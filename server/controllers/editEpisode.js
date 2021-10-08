const path = require("path");
const {episodeFileName} = require("./../../constants.js");
const fs = require("fs");
const _ = require("./../../isType.js");
const db = require("./../db/db.js");
const {v4: uuidv4} = require("uuid");
const err = require( "./../errorHandler.js" );

const {
    pathExists
} = require( "./../utils/pathHelpers.js" );

module.exports = {
    saveEpisode,
    saveAllEpisodesInSeries,
    parseEpisodeData,
    deleteEpisode,
};

function deleteEpisode( req, res ){
    const episodeId = req.query.id;
    let noError = true;

    try {
        db.removeEpisode( episodeId );
    } catch ( error ){
        err.handler( error );
        res.send({ err: true, msg: error.message });
        noError = false;
    }

    if( noError ){
        res.send({ msg: "Success, episode deleted." });
    }
}

function saveEpisode( req, res ){
    const newEpisode = parseEpisodeData( req.body );
    newEpisode.TYPE = "episode";

    if( !validEpisodeData( newEpisode ) ){
        if( isNewEpisode( newEpisode ) ){
            newEpisode.ID = uuidv4();
            newEpisode.new = true;
        } else {
            res.json({msg: "Please ensure that the data being saved is valid.", err: true});
            return;
        }
    }

    if( db.update( newEpisode.ID, newEpisode ) ){
        res.json({msg: "Successfully updated episode!"});
    } else {
        res.json({msg: "Something went wrong. See the console...", err: true});
    }
}


function saveAllEpisodesInSeries( seriesId, episodeData ){
    let _seriesData = db.seriesData().find( s => s.seriesId === seriesId );

    if( !_seriesData )
        throw new Error( `The series id, ${seriesId}, does not exist.` );

    let episodeDataPath = path.join( _seriesData.path, episodeFileName );
    let res = true;

    try{
        fs.writeFileSync( episodeDataPath, JSON.stringify( episodeData ) );
    } catch( err ){
        console.error( err );
        res = false;
    }

    return res;
}

function parseEpisodeData( episode ){
    episode.season = +episode.season;
    episode.number = +episode.number;
    episode.rating = +episode.rating;
    episode.raters = +episode.raters;

    return episode
}


function validEpisodeData( data ){
    // console.log( data );
    // basic type verification
    return isNewEpisode( data )
        && _.isString( data.ID )
}

function isNewEpisode( data ){
    return _.isObject( data )
        && _.isString( data.TYPE )
        && data.TYPE === "episode"
        && _.isString( data.seriesId )
        && _.isString( data.series )
        && _.isString( data.title )
        && _.isString( data.path )

        && _.isStringOrNull( data.description )
        && _.isStringOrNull( data.imgLink )
        && _.isStringOrNull( data.airDate )
        && _.isStringOrNull( data.nextEpisode )

        && _.isIntegerOrNull( data.season )
        && _.isIntegerOrNull( data.number )
        && _.isIntegerOrNull( data.raters )

        && _.isDoubleOrNull( data.rating )

        // check if files exist
        && pathExists( data.path )
        && (data.nextEpisode ? pathExists( data.nextEpisode ) : true)
}