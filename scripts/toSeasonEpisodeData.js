const path = require( "path" );
const fs = require( "fs" );
const { v4: uuidv4 } = require( "uuid" );

const { walk } = require( "./../walk.js" );

const { videoRoot } = require( "./../constants.js" );

// console.log( videoRoot );

const paths = walk( videoRoot );

// console.log( paths );

const { episodeNames, episodeDataPaths, episodePaths } = paths.reduce(
    function( acc, val ){
        if( val.endsWith( "episodeList.json" ) )
            acc.episodeNames = val;

        if( val.endsWith( ".mp4" ) )
            acc.episodePaths.push( val );
        else if( val.endsWith( "_episodeDescriptions.json" ) )
            acc.episodeDataPaths.push( val );

        return acc;
    },
    { episodeNames:"", episodeDataPaths: [], episodePaths: [] }
)

// console.log( episodeDataPaths );
// console.log( episodePaths );

let seriesIdMap = Object.create(null);
let allEpisodes = [];

let seasonEps = {};
let epData = {};
let newData = {};
let matchingFilePath = [];
let dirs = [];
let episodeNamesData = require( episodeNames );

let seriesId = "";
let series = "";
let season = "";
let seasonNum = 0;
let nextSeasonNum = 0;
let epFileNameIndex = 0;
let nextSeasonStr = "";
let epNumStr = "";
let epFileName = "";
let nextEpFileName = "";
let nextMatchingFilePath = "";

for( let i = 0, l = episodeDataPaths.length; i < l; ++i ){
    seasonEps = require( episodeDataPaths[i] );
    dirs = episodeDataPaths[i].split( "\\" );
    dirs.pop();

    series = dirs[ dirs.length - 2 ]
    season = dirs[ dirs.length - 1 ]

    if( !seriesIdMap[ series ] )
        seriesIdMap[ series ] = uuidv4();

    seriesId = seriesIdMap[ series ] + "";
    seasonNum = +( season.toLowerCase().replace( "season", "" ).trim() )

    // console.log( series );
    // console.log( seasonNum );

    for( let j = 0, jl = seasonEps.length; j < jl; ++j ){
        epData = seasonEps[j];

        newData = {};
        epNumStr = epData.number;
        epFileNameIndex = episodeNamesData[ season ].findIndex( ep => ep.number === epNumStr );
        epFileName = episodeNamesData[ season ][ epFileNameIndex ].name;

        if( epFileNameIndex !== episodeNamesData[ season ].length - 1 )
            nextEpFileName = episodeNamesData[ season ][ epFileNameIndex + 1 ].name
        else {
            nextSeasonNum = seasonNum + 1;
            nextSeasonStr = season.replace( seasonNum.toString().padStart( 2, "0" ),  nextSeasonNum.toString().padStart( 2, "0" ) )

            if( episodeNamesData[ nextSeasonStr ] )
                nextEpFileName = episodeNamesData[ nextSeasonStr ][0].name
            else
                nextEpFileName = null
        }


        matchingFilePath = episodePaths.find( function(p) {
            return p.toLowerCase().includes( season.toLowerCase() )
                && p.toLowerCase().endsWith( epFileName.toLowerCase() + ".mp4" )
        });

        if( nextEpFileName !== null )
            nextMatchingFilePath = episodePaths.find( p => p.toLowerCase().endsWith( nextEpFileName.toLowerCase() + ".mp4" ) )
        else
            nextMatchingFilePath = null;

        // console.log( epFileName );
        // console.log( "==========================================================================" );
        // console.log( matchingFilePath );
        // console.log( nextMatchingFilePath );

        newData.ID = uuidv4();
        newData.seriesId = seriesId;

        newData.series  = series;
        newData.season  = seasonNum;
        newData.title   = epData.title;
        newData.imgLink = epData.imgLink;
        newData.airDate = epData.airDate;

        newData.path    = matchingFilePath;

        newData.number  = +epData.number;
        newData.rating  = +epData.rating;
        newData.raters  = +epData.raters;

        newData.description = epData.description;
        newData.nextEpisode = nextMatchingFilePath;

        allEpisodes.push( newData );
    }
}

fs.writeFileSync( path.join( videoRoot, "Castle", "_mediaPlayerData.json" ), JSON.stringify( allEpisodes ), "utf8" )