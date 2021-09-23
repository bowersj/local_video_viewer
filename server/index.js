const fs = require("fs");
const path = require( "path" );

const mime = require('mime-types')
const express = require("express");
const exphbs = require('express-handlebars');

const port = 3000;
const app = express();

const { mediaRoot, seriesDataRoot, episodeFileName } = require( "./../constants.js" );
let seriesData = require( path.join( mediaRoot, "_allMediaPlayerSeriesData.json" ) )


app.use(express.static(path.join( __dirname, "./public" )));



app.engine('hbs', exphbs({
    partialsDir:  __dirname + "/views/partials/",
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require( "./handlerHelpers.js" )
}));


app.set('view engine', 'hbs');


app.get('/', (req, res) => {
    res.render('series', { layout: "grid.hbs", menu:{ series: false }, series: seriesData });
});

app.get( '/series_episodes', ( req, res ) => {
    const series = req.query.ser;

    res.render(
        'episodes',
        {
            episode: getAllEpisodesInSeries( series ),
            menu:{ series: true },
            link: [
                { href: "./css/episodeList.css" }
            ],
            script:[
                { src: "./JS/importedModules/lunr.js" },
                { src: "./JS/searchHelpers.js" },
            ],
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
            src: `/stream?ser=${seriesId}&id=${episodeId}`,
            type: "video/mp4",
            title: series,
            subtitle: title,
        },
        season,
        script: [
            { src: "./JS/app.js" },
        ],
        menu:{
            series: true,
            style: "position: absolute; z-index: 999;",
            episode:{ seriesId: seriesId, series: series }
        },
        episode: seriesEpisodeData.reduce( (acc, ep) => {
            ep.includeBottomBorder = true;
            if( ep.season === season ){
                acc.push( ep );
            }

            return acc;
        }, []),
    };


    if( nextEpisode ){
        let nxtEpData = seriesEpisodeData.find( epData => epData.path === nextEpisode );

        if( nxtEpData )
            options.nextEpisode = `/watch?ser=${nxtEpData.seriesId}&id=${nxtEpData.ID}&autoStart=true`;
    }

    res.render( 'video', options );
});

app.get("/stream", function (req, res) {
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
        res.status( 404 ).send( "[/stream]: " + error.message );
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
        "Content-Type": mime.lookup( videoPath ),
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
});

app.get( "/edit-episode", ( req, res )=>{
    let doc = getEpisodeData( req );

    let opts = {};
    opts.layout = "form.hbs";
    opts.script = [
        { src: "./JS/form-episode.js" },
    ];
    res.render( "form-episode.hbs", opts );
});

app.get( "/series", ( req, res )=>{
    res.json( seriesData.map( series => {
        return { id: series.seriesId, value: series.series }
    }) );
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
    let _seriesData = seriesData.find( s => s.seriesId === seriesId );

    // console.log( _seriesData );

    if( !_seriesData )
        throw new Error( `The series id, ${seriesId}, does not exist.` );

    let episodeData = require( path.join( _seriesData.path, episodeFileName ) )

    if( !episodeData )
        throw new Error( `every series must have a file containing every episode's metadata named ${episodeFileName}` );

    // return allEpisodeData[ seriesId ];

    return episodeData;
}


function getSeriesData(){
    return require( seriesDataRoot );
}