const path = require( "path" );
const fs   = require( "fs" );

const _ = require("./../../isType.js");
const { pathExists } = require( "./../utils/pathHelpers.js" );
const db = require("./../db/db.js");
const err = require("./../errorHandler.js");


module.exports = {
    saveSeries, deleteSeries
};


function deleteSeries( req, res ){
    const seriesId = req.query.id;
    let noError = true;

    try {
        db.removeSeries( seriesId );
    } catch ( error ){
        err.handler( error );
        res.send({ err: true, msg: error.message });
        noError = false;
    }

    if( noError ){
        res.send({ msg: "Success, episode deleted." });
    }
}

// TODO: add ability to save a new series,
//  also when saving a new series automatically create a file name and an episode
function saveSeries( req, res ){
    const seriesObj = req.body;
    const seriesId = seriesObj.seriesId;

    seriesObj.TYPE = "series";

    if( !validSeries( seriesObj ) ){
        res.json({msg: "Please ensure that the data being saved is valid.", err: true});
        return;
    }

    // const seriesData = db.seriesData();
    // const idx = seriesData.findIndex( s => s.seriesId === seriesId );

    // if( idx === -1 ){
    //     seriesData.push( seriesObj );
    // } else {
    //     seriesData[ idx ] = seriesObj;
    // }

    if( db.updateSeries( seriesId, seriesObj ) ){
        res.json({msg: "Successfully updated Series!"});
    } else {
        res.json({msg: "Something went wrong. See the console...", err: true});
    }
}



function validSeries( data ){
    return _.isObject( data )
    && _.isString( data.seriesId )
    && _.isString( data.series )

    && _.isStringOrNull( data.imgSrc )
    && _.isStringOrNull( data.description )
}