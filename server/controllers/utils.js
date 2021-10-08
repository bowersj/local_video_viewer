const path = require( "path" );
const fs = require("fs");

const {pathExists} = require( "./../utils/pathHelpers.js" )
const { episodeFileName, seriesDataRoot, indexNames:{ idToLoc, mediaToId } } = require("./../../constants.js");
const db = require( "./../db/db.js" );
const err = require( "./../errorHandler.js" );

module.exports = {
    getEpisodeData,
    getAllEpisodesInSeries,
    getSeries,
    loadJSON,
};


function loadJSON( filePath ){
    if( !pathExists( filePath ) )
        throw new Error( `the filePath, ${filePath}, doesn't exist` );

    return JSON.parse( fs.readFileSync( filePath, "utf8" ) );
}



// TODO add res to params
function getEpisodeData( req ){
    const q = req.query;
    const episodeId = q.id;
    let episode = db.getEpisode( episodeId );

    if( !episode ){
        throw new Error( `The episode with the id ${episodeId} does not exist.` )
    }

    return episode;
}

function getAllEpisodesInSeries( seriesId ){
    let episodeData = [];

    try {
        episodeData = db.getSeriesEpisodes( seriesId );
    } catch ( err ){
        console.error( err );
        return [];
    }

    if( !episodeData )
        throw new Error( `every series must have a file containing every episode's metadata named ${episodeFileName}` );

    return episodeData;
}

function getSeries( req ){
    const seriesId = req.query.ser;

    const series = db.getSeries( seriesId );

    if( !series ){
        throw new Error( `The series with the id ${seriesId} does not exist.` );
    }

    return series;
}