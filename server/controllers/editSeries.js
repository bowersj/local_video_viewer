const path = require( "path" );
const fs   = require( "fs" );

const _ = require("./../../isType.js");
const {episodeFileName, seriesDataRoot} = require("./../../constants.js");
const {getAllEpisodesInSeries, pathExists} = require("./utils.js");
const {getSeriesData} = require("./utils");


module.exports = {
    saveSeries
};


function saveSeries( req, res ){
    const seriesObj = req.body;
    const seriesId = seriesObj.seriesId;

    if( !validSeries( seriesObj ) ){
        res.json({msg: "Please ensure that the data being saved is valid.", err: true});
        return;
    }

    const seriesData = getSeriesData();
    const idx = seriesData.findIndex( s => s.seriesId === seriesId );

    if( idx === -1 ){
        seriesData.push( seriesObj );
    } else {
        seriesData[ idx ] = seriesObj;
    }

    if( saveAllSeries( seriesData ) ){
        res.json({msg: "Successfully updated Series!"});
    } else {
        res.json({msg: "Something went wrong. See the console...", err: true});
    }
}

function saveAllSeries( seriesData ){
    let res = true;

    try {
        fs.writeFileSync( seriesDataRoot, JSON.stringify( seriesData ) )
    } catch ( err ){
        console.error( err );
        res = false;
    }

    return res;
}



function validSeries( data ){
    return _.isObject( data )
    && _.isString( data.seriesId )
    && _.isString( data.series )
    && _.isString( data.path )

    && _.isStringOrNull( data.imgSrc )
    && _.isStringOrNull( data.description )

    && pathExists( data.path )
}