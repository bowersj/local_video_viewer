const path = require( "path" );
const {episodeFileName, seriesDataRoot} = require("./../../constants.js");


module.exports = {
    getEpisodeData,
    getAllEpisodesInSeries,
    getSeriesData,
    getSeries
};


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
    let _seriesData = getSeriesData().find( s => s.seriesId === seriesId );

    // console.log( _seriesData );

    if( !_seriesData )
        throw new Error( `The series id, ${seriesId}, does not exist.` );

    let episodeData = require( path.join( _seriesData.path, episodeFileName ) );

    if( !episodeData )
        throw new Error( `every series must have a file containing every episode's metadata named ${episodeFileName}` );

    // return allEpisodeData[ seriesId ];

    return episodeData;
}

function getSeriesData(){
    return require( seriesDataRoot );
}

function getSeries( req ){
    const seriesId = req.query.ser;

    const series = getSeriesData().find( ser => ser.seriesId === seriesId );

    if( !series ){
        throw new Error( `The series with the id ${seriesId} does not exist.` );
    }

    return series;
}