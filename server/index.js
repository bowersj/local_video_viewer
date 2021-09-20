const fs = require("fs");
const path = require( "path" );

const express = require("express");
const exphbs = require('express-handlebars');

const port = 3000;
const app = express();

const { videoRoot } = require( "./../constants.js" );
const { walk } = require( "./../walk.js" );


// Data preparation
let allVideoPaths = walk( videoRoot );
let allEpisodeData = allVideoPaths
    .filter( p => p.includes( "_mediaPlayerData.json" ) )
    .reduce( ( acc, p ) => {
            require( p ).forEach(function( epData ){
               if( acc[ epData.seriesId ] )
                   acc[ epData.seriesId ].push( epData )
                else
                   acc[ epData.seriesId ] = [ epData ];
            });

            return acc;
        },
        Object.create(null)
    );

let seriesData = require( path.join( videoRoot, "_allMediaPlayerSeriesData.json" ) )

app.use(express.static(path.join( __dirname, "./JS" )));
app.use(express.static(path.join( __dirname, "./css" )));

app.engine('hbs', exphbs({
    partialsDir:  __dirname + "/views/partials/",
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require( "./handlerHelpers.js" )
}));


app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('series', { layout: "grid.hbs", series: seriesData });
});

app.get( '/series_episodes', ( req, res ) => {
    const series = req.query.ser;

    res.render(
        'episodes',
        {
            episode: getAllEpisodesInSeries( series ),
            link: [ { href: "./episodeList.css" } ]
        }
    );
});

app.get('/watch', (req, res) => {

    let errorOccurred = false;
    let episode = {};

    try {
        episode = getEpisodeData( req );
    } catch( error ){
        res.status( 404 ).send( "[/watch]: " + error.message );
        errorOccurred = true;
    }

    if( errorOccurred )
        return;


    const { season, seriesId, series, title, ID: episodeId, nextEpisode } = episode;

    const seriesEpisodeData = getAllEpisodesInSeries( seriesId );

    const options = {
        layout: "media-video.hbs",
        video: {
            src: `/video?ser=${seriesId}&id=${episodeId}`,
            type: "video/mp4",
            title: series,
            subtitle: title,
        },
        season,
        episode: seriesEpisodeData.reduce( (acc, ep) => {
            ep.includeBottomBorder = true;
            if( ep.season === season ){
                acc.push( ep );
            }

            return acc;
        }, [])
    };

    if( nextEpisode ){
        let nxtEpData = seriesEpisodeData.find( epData => epData.path === nextEpisode );

        if( nxtEpData )
            options.nextEpisode = `/watch?ser=${nxtEpData.seriesId}&id=${nxtEpData.ID}`;
    }


    res.render( 'video', options );
});

app.get("/video", function (req, res) {
    // Ensure there is a range given for the video
    let range = req.headers.range || "0-";
    // console.log( req.headers )
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }

    let errorOccurred = false;
    let episode = {};

    try {
        episode = getEpisodeData( req );
    } catch( error ){
        res.status( 404 ).send( "[/video]: " + error.message );
        errorOccurred = true;
    }

    if( errorOccurred )
        return;


    const { path: videoPath } = episode;

    const videoSize = fs.statSync( videoPath ).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 7; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
});



app.listen(port, () => {
    console.log('The web server has started on port ' + port);
});

function getEpisodeData( req ){
    const q = req.query;
    const seriesId = q.ser;
    const episodeId = q.id;

    const seriesEpisodeData = getAllEpisodesInSeries( seriesId );

    if( !seriesEpisodeData ){
        throw new Error( `The series with the id ${seriesId} does not exist.` );
    }

    // console.log( episodeId );
    // console.log( seriesEpisodeData[0] );

    const episode = seriesEpisodeData.find( ep => ep.ID === episodeId );

    if( !episode ){
        throw new Error( `The episode with the id ${episodeId} does not exist.` )
    }

    return episode;
}

function getAllEpisodesInSeries( seriesId ){
    return allEpisodeData[ seriesId ];
}
