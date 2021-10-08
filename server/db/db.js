const fs = require( "fs" );
const path = require( "path" );
const { v4: uuid } = require( "uuid" );

const { seriesDataFileName, indexNames:{ idToLoc: idToLocName, mediaToId } } = require("./../../constants.js");
const { Index } = require( "./index.js" );
const _ = require("./../../isType.js");
const { isRelativePath, pathExists } = require("../utils/pathHelpers.js");

const dataDir = path.join( __dirname, "./data" );
const backupDir = path.join( dataDir, "./backup" );
const toRoot = "./" + dataDir.split( path.sep ).slice( 1 ).map( node => ".." ).join( "/" )


let idToLoc = Object.create( null );
let mediaLocToId = Object.create( null );
let indexName = Object.create( null );

// build maps
try {
    fs.readdirSync( dataDir ).map( p => buildMaps( path.join( dataDir, p ) ) );
} catch( err ){
   console.error( err )
}
// This index maps the id of the media item to the file it exists in
const idToLocIndex      = new Index({ name: idToLocName,  elements: idToLoc })
// This index maps the stored location of the media item to the Id of the metadata for that item.
const mediaLocToIdIndex = new Index({ name: mediaToId,    elements: mediaLocToId });


indexName[ idToLocName ]  = idToLocIndex;
indexName[ mediaToId ]    = mediaLocToIdIndex;

function buildMaps( filePath ){

    if( fs.statSync( filePath ).isDirectory() )
        return;

    // console.log( "uploading " + filePath );
    const data = JSON.parse( fs.readFileSync( filePath, "utf8" ) );

    let type = "";
    let id = "";
    let dataLoc = "";
    let item = {};

    for( let i = 0, l = data.length; i < l; ++i ){
        item = data[i];
        type = item.TYPE;

        // console.log( type );

        switch( type ){
            case "episode":
                id = item.ID;
                dataLoc = parsePath( filePath );
                // console.log( item )

                // only episode data at the moment needs this index;
                mediaLocToId[ parsePath( item.path ) ] = id;
                break;
            case "series":
                id = item.seriesId;
                dataLoc = filePath;
                break;
        }

        // every metadata object includes both an id and its location
        idToLoc[ id ] = dataLoc;

    }
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

function parsePath( p ){
    // all relative paths are relative to the Root of the drive
    // so ./media must exist on the save drive as the code, so if that is drive E then ./media ~ E:/media
    // This is useful for external hard drives.
    if( isRelativePath( p ) ) {
        return path.resolve( path.join( toRoot, p ) );
    } else {
        return path.normalize( p );
    }
}

function formatDate( d ){
    if( !d || !( d instanceof Date ) )
        d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}_${d.getUTCHours()}${d.getUTCMinutes()}${d.getUTCSeconds()}`;
}

function getFileNameFromPath( path ){
    let nodes = path.replace( /[/\\]+/g, "/" ).split( "/" );
    return nodes[ nodes.length - 1 ];
}

function removeExtension( path ){
    let parts = path.split( "." );
    parts.pop();
    return parts.join( "." );
}

const db = {
    dataDir,
    seriesFile: path.join( dataDir, seriesDataFileName ),
    has: function has( idxName, val ){
        const index = indexName[ idxName ];

        if( _.isNull( index ) )
            throw new Error( `An index with the name of ${idxName} does not exist.` );

        return index.has( val );
    },
    get: function get( idxName, val ){
        const index = indexName[ idxName ];

        if( _.isNull( index ) )
            throw new Error( `An index with the name of ${idxName} does not exist.` );

        return index.get( val );
    },

    getSeriesFilePath(){ return path.join( dataDir, seriesDataFileName ) },

    backupSeriesData(){
        let seriesFilePath = this.getSeriesFilePath();
        return fs.copyFileSync( seriesFilePath, path.join( backupDir, removeExtension( seriesDataFileName ) + formatDate() + ".json" ) );
    },

    seriesData: function seriesData(){ return require( this.getSeriesFilePath() ) },

    getSeries: function getSeries( seriesId ){
        if( _.isNull( seriesId ) )
            throw new Error( `seriesId must not be empty.` );

        return this.seriesData().find( series => series.seriesId === seriesId );
    },

    backupSeriesEpisodeData( seriesId ){
        let seriesData = this.getSeries( seriesId );
        let fileName = getFileNameFromPath( seriesData.path );
        let seriesFilePath = "";

        if( isRelativePath( seriesData.path ) ){
            seriesFilePath = path.join( backupDir, seriesData.path );
        } else {
            seriesFilePath = seriesData.path + "";
        }

        return fs.copyFileSync( seriesFilePath, path.join( backupDir, removeExtension( fileName ) + formatDate() + ".json" ) );
    },

    getEpisode: function getEpisode( episodeId ){
        return this.getData( this.get( idToLocName, episodeId ) ).find( ep => ep.ID === episodeId );
    },

    getData: function getData( location ){
        if( _.isNull( location ) )
            throw new Error( `location must not be empty.` );

        return require( location );
    },

    getSeriesEpisodesLocation: function getSeriesEpisodes( seriesId ){
        let seriesData = this.getSeries( seriesId );
        return path.join( dataDir, seriesData.path );
    },

    getSeriesEpisodes: function getSeriesEpisodes( seriesId ){
        return this.getData( this.getSeriesEpisodesLocation( seriesId ) );
    },


    update: function update( id, data ){
        if( data.TYPE && !_.isStringOrNull( data.path ) )
            throw new Error( `every data item must have a path and a TYPE property` );

        let PATH = parsePath( data.path );
        let dataFromDisc = {};
        let idx = -1;

        indexName[ mediaToId ].set( PATH, id );

        // if( data.new ){
        //     let series = this.getSeries( data.seriesId );
        //     dataFromDisc = this.getData( path.join( dataDir, series.path ) );
        //     delete data.new;
        // } else {
        //     dataFromDisc = this.getSeriesEpisodes( data.seriesId );
        // }

        dataFromDisc = this.getSeriesEpisodes( data.seriesId );

        idx = dataFromDisc.findIndex( ep => ep.ID === id );


        if( idx === -1 ){
            dataFromDisc.push( data );
            dataFromDisc.sort( tvSeriesComparator );
        } else {
            dataFromDisc[ idx ] = data;
        }

        return this._saveEpisodeFile( dataFromDisc, data.seriesId );
    },

    updateSeries( id, data ){
        if( !_.isStringOrNull( data.path ) )
            throw new Error( `every data item must have a path and a TYPE property` );

        data.TYPE = "series";

        let seriesData = this.seriesData();
        let idx = seriesData.findIndex( ser => ser.seriesId === id );

        if( idx === -1 ){
            seriesData.push( data );
            seriesData.sort( tvSeriesComparator );
        } else {
            seriesData[ idx ] = data;
        }

        if( !( idx === -1 && data.path && pathExists( data.path ) ) ){
            console.log( "creating new file" );
            let fileName = uuid();
            let filePath = path.join( dataDir, fileName + ".json" )
            data.path = filePath;
            fs.writeFileSync( filePath, "[]" );
        } else if ( idx === -1 ){
            console.log( "path doesn't exist..." );
        }

        return this._saveSeriesFile( seriesData );
    },


    removeEpisode( episodeId ){
        const episode = this.getEpisode( episodeId );
        const { ID: id, seriesId, path } = episode;
        let data = this.getSeriesEpisodes( seriesId ).filter( ep => id !== ep.ID );
        indexName[ idToLocName ].remove( id );
        indexName[ mediaToId ].remove( parsePath( path ) );
        return this._saveEpisodeFile( data, seriesId );
    },

    removeSeries( seriesId ){
        this.backupSeriesData();
        this.backupSeriesEpisodeData( seriesId );

        indexName[ idToLocName ].remove( seriesId );

        return this._saveSeriesFile( this.seriesData().filter( series => seriesId !== series.seriesId ) );
    },


    _saveEpisodeFile: function _saveEpisodeFile( data, seriesId ){
        let p = this.getSeriesEpisodesLocation( seriesId );
        console.log( p );
        try {
            fs.writeFileSync(p, JSON.stringify(data));
        } catch (error){
            console.error( error );
            return false;
        }

        return true;
    },

    _saveSeriesFile: function _saveSeriesFile( data ){
        let p = path.join( dataDir, seriesDataFileName )
        // console.log( p );
        try {
            fs.writeFileSync(p, JSON.stringify(data));
        } catch (error){
            console.error( error );
            return false;
        }

        return true;
    }
};

module.exports = db;

// console.log( mediaLocToIdIndex.getKeys() )
// console.log( mediaLocToIdIndex.get( "E:\\Media\\TV_Serries\\Merlin\\Season 05\\E13_The Diamond of the Day - Part 2.mp4" ) )

// db.update( 
//     "55600f79-634f-4f60-a8a8-dbf91fa4d6d3",
//     { "TYPE": "episode",
//         "ID": "55600f79-634f-4f60-a8a8-dbf91fa4d6d3",
//         "seriesId": "b13c087d-51b3-4af7-b7ee-c575ef0a19ac",
//         "series": "Castle",
//         "season": 4,
//         "title": "Rise",
//         "imgLink": "https://m.media-amazon.com/images/M/MV5BNjk0NDU4MzI3M15BMl5BanBnXkFtZTcwNDk0MTU2Ng@@._V1_UX224_CR0,0,224,126_AL_.jpg",
//         "airDate": "2011-09-19",
//         "path": "./Media/TV_Serries/Castle/season 04/E01_Rise.mp4",
//         "number": 1,
//         "rating": 8.7,
//         "raters": 1424,
//         "description": "Beckett fights for her life after her shooting while the 12th precinct gets a new tough captain, Victoria Gates.",
//         "nextEpisode": "./Media/TV_Serries/Castle/season 04/E02_Heroes & Villains.mp4"
//     }
// )

// console.log( db.getEpisode( "55600f79-634f-4f60-a8a8-dbf91fa4d6d3" ) );