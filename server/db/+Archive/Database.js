const fs = require( "fs" );
const { isArray, isNull } = require("../../isType.js");
const { v4:uuidv4 } = require( "uuid" );
const {UnsafeDictionary} = require("./dictionary");
const {Index: IdIndex} = require( "./index.js" )
const path = require("path");

const defaultLocation = "./data/backup";
const defaultDbPrefix = "db_";

// use https://github.com/paulmillr/chokidar to watch file system for changes

module.exports = class Database {
    constructor({ dbId, indexes } = {}) {
        if( !isArray( indexes ) )
            throw new Error( 'indexes must be an array of config objects to create indexes' );

        this.dbName = dbId || uuidv4();

        this.indexes = indexes.reduce(
            function( acc, indexConfig ){
                acc.name = new IdIndex( indexConfig );
                return acc;
            },
            Object.create( null )
        );

    }

    queryById( indexName, id ){
        let idx = this._getIndex( indexName );
        return idx.get( id );
    }

    updateById( indexName, id, newValue ){
        let idx = this._getIndex( indexName );
        return idx.set( id, newValue );
    }

    _getIndex( indexName ){
        return this.indexes[ indexName ];
    }

    serialize(){
        return {
            name: this.dbName + "",
            indexes: this.indexes.map( index => index.serialize() )
        }
    }

    persistChange(  ){

    }

    persistAll( dirLoc ){
        if( isNull( dirLoc ) )
            dirLoc = path.resolve( defaultLocation );
        else {
            if( !fs.statSync( dirLoc ).isDirectory() )
                throw new Error( "The provided file location must be a directory" );
        }


        // save db settings
        fs.writeFileSync(
            buildSaveLocation( dirLoc, defaultDbPrefix,  this.dbName, "json" ),
            JSON.stringify({ dbId: this.dbName })
        )

        // save each index contents and settings
        const indexes = this.indexes;
        let prop = Object.getOwnPropertyNames( indexes );

        for( let i = 0, l = prop.length; i <l; ++i ){
            indexes[ prop[i] ].persist( dirLoc );
        }

        return this;
    }
}

function buildSaveLocation( root, prefix, name, extension ){
    return path.join( root, prefix + name + "." + extension )
}