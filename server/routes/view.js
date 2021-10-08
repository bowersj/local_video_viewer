const path = require( "path" );
const fs = require("fs");
const mime = require("mime-types");
const express = require( "express" );


const err = require( "./../errorHandler.js" );

const routeFor = require( "./../route.js" );

const { getAllEpisodesInSeries, getEpisodeData } = require( "./../controllers/utils.js" );

const toRoot = "./" + __dirname.split( path.sep ).slice( 1 ).map( node => ".." ).join( "/" )
const router = express.Router();


router.get( routeFor.seriesEpisodes, ( req, res ) => {
    const series = req.query.ser;

    try {
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
    } catch( error ){
        err.handler( error, res, 500, "[/watch]: " + error.message );
    }
});


router.get( routeFor.watch, (req, res) => {
    try {
        let errorOccurred = false;
        let episode = {};

        try {
            episode = getEpisodeData( req );
        } catch( error ){
            err.handler( error, res, 404, "[/watch]: " + error.message );
            errorOccurred = true;
        }

        if( errorOccurred )
            return;

        const { season, number, seriesId, series, title, ID: episodeId, nextEpisode } = episode;

        const seriesEpisodeData = getAllEpisodesInSeries( seriesId );

        const options = {
            layout: "media-video.hbs",
            video: {
                src: `/stream?id=${episodeId}`,
                type: "video/mp4",
                title: series,
                subtitle: title,
            },
            season,
            epNumber: number,
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
    } catch( error ){
        console.error( error );
    }
});


router.get( routeFor.stream, function (req, res) {
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


    let { path: videoPath } = episode;
    videoPath = path.resolve( path.join( toRoot, videoPath ) );

    streamMedia( req, res, videoPath );
});

router.get( routeFor.watchFromFile, (req, res) => {
    try {
        const p = req.query.path;
        const fileName = path.basename( p ).split( "." );

        // console.log( fileName )

        const options = {
            layout: "media-video.hbs",
            video: {
                src: `${routeFor.streamFromFile}?path=${p}`,
                type: mime.lookup( p ),
                title: fileName[0],
            },
            script: [
                { src: "./JS/app.js" },
            ],
            menu:{
                fileExplorer: true,
                style: "position: absolute; z-index: 999;",
            },
        };
        res.render( 'video', options );
    } catch( error ){
        console.error( error );
    }
});

router.get( routeFor.streamFromFile, function (req, res) {
    const path = req.query.path;
    streamMedia( req, res, path );
});

function streamMedia( req, res, mediaPath ){
    // Ensure there is a range given for the video
    let range = req.headers.range || "0-";
    // console.log( req.headers )
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }

    let videoSize = 0;

    try {
        videoSize = fs.statSync( mediaPath ).size;
    } catch ( error ){
        console.error( error );
        res.status(404).send("There was a problem... the media doesn't exist where it is supposed to...");
        return;
    }

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": mime.lookup( mediaPath ),
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(mediaPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
}


module.exports = router;