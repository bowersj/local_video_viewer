const path = require("path");
const {episodeFileName} = require("./../../constants.js");
const fs = require("fs");
const _ = require("./../../isType.js");

const {
    getAllEpisodesInSeries,
    getSeriesData
} = require( "./utils.js" );

module.exports = {
    saveEpisode,
    saveAllEpisodesInSeries,
    parseEpisodeData,

};

function saveEpisode( req, res ){
    const newEpisode = parseEpisodeData( req.body );
    const seriesId = newEpisode.seriesId;
    const episodeId = newEpisode.ID;

    if( !validEpisodeData( newEpisode ) ){
        res.json({msg: "Please ensure that the data being saved is valid.", err: true});
        return;
    }


    const seriesEpisodeData = getAllEpisodesInSeries( seriesId );

    if( !seriesEpisodeData ){
        throw new Error( `The series with the id ${seriesId} does not exist.` );
    }

    const idx = seriesEpisodeData.findIndex( ep => ep.ID === episodeId );

    if( idx === -1 ){
        seriesEpisodeData.push( newEpisode );
        seriesEpisodeData.sort( tvSeriesComparator )
    } else {
        seriesEpisodeData[ idx ] = newEpisode;
    }

    if( saveAllEpisodesInSeries( seriesId, seriesEpisodeData ) ){
        res.json({msg: "Successfully updated episode!"});
    } else {
        res.json({msg: "Something went wrong. See the console...", err: true});
    }
}


function saveAllEpisodesInSeries( seriesId, episodeData ){
    let _seriesData = getSeriesData().find( s => s.seriesId === seriesId );

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

const isLetter = /[a-zA-Z]/g

// All absolute paths start with the drive Letter
function isRelativePath( p ){
    const fChar = p.charAt(0);
    return !isLetter.test( fChar );
}

function pathExists( p ){
    if( isRelativePath( p ) ){
        p = path.resolve( p );
    }

    let stat = {};

    try {
        stat = fs.statSync( p );
    } catch ( error ){
        // console.error( error );
        return error.code !== "ENOENT";
    }

    return stat.isFile();
}


function validEpisodeData( data ){
    // basic type verification
    return _.isObject( data )
        && _.isString( data.ID )
        && _.isString( data.seriesId )
        && _.isString( data.series )
        && _.isString( data.title )
        && _.isString( data.path )
        && _.isString( data.description )

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

function tvSeriesComparator( ep1, ep2 ){
    if( ep1.season === ep2.season ){
        if( ep1.number < ep2.number ){
            return -1;
        } else if( ep1.number > ep2.number ){
            return 1;
        } else {
            return 0;
        }
    } else if( ep1.season > ep2.season ){
        return 1;
    } else {
        return -1;
    }
}