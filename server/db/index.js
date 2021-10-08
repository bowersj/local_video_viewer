const fs = require( "fs" );
const { UnsafeDictionary } = require( "./dictionary" );
const { isArray, isNull} = require( "../../isType.js" );
const { Event } = require( "./event.js" );
const path = require("path");

const defaultPrefix = "index_";

module.exports = {};

module.exports.Index = class Index extends UnsafeDictionary {
    constructor({ name, elements }) {
        super( elements );
        this.name = name;
        this.es = new Event( name + "_events" );
    }

    on( eventId, fn ){ this.es.on( eventId, fn ) }

    emit( eventId, data ){ this.es.emit( eventId, data ) }

    blockEvents(){ this.es.blockEvents() }

    unblockEvents(){ this.es.unblockEvents() }

    has(key) {
        return super.has(key);
    }

    get(key, throwError = true) {
        return super.get( key, throwError );
    }

    set( key, value ){
        super.set( key, value );
        return super.get( key );
    }

    remove(key) {
        return super.remove(key);
    }

    getValues(){
        return super.getAllValues();
    }

    getKeys(){
        return super.getAllElements();
    }

    serialize(){
        return {
            name: this.name,
            elements: super.serialize()
        }
    }

    persist( dirLoc ){
        if( isNull( dirLoc ) )
            throw new Error( "fileLoc must be provided" );

        if( !fs.statSync( dirLoc ).isDirectory() )
            throw new Error( "The provided file location must be a directory" );

        fs.writeFileSync(
            path.join( dirLoc, defaultPrefix + this.name + ".json" ),
            JSON.stringify( this.serialize() )
        )
    }
}

/**
 * @class ManyIndex
 * @property name {String}
 * @property id {Id} - this is a private property to help keep track of the index.
 * @property description {String}
 * The difference between an Index and this, is that Index_many always stores an array. This is a nice abstraction
 * for dealing with many things but not having to worry about the details of working with many things.
 */
module.exports.ManyIndex = class ManyIndex extends UnsafeDictionary {

    /**
     * @constructor
     *
     * @param {String} [props.name = ""]
     * @param {String} [props.description = ""]
     */
    constructor( props ) {
        super( props );
        const { name = "", description = "" } = props;
        this.name = name;
        this.id = buildId();
        this.description = description;
    }

    /**
     * @method has
     * @methodOf Index_many
     *
     * checks if the index has an entry for the provided key.
     *
     * @return {Boolean}
     */
    has(key) {
        return super.has(key);
    }

    /**
     * @method get
     * @methodOf Index_many
     *
     * retrieves the value of the  provided key.
     *
     * @return {*}
     */
    get(key, throwError = true) {
        return super.get( key, throwError );
    }

    /**
     * @method set
     * @methodOf Index_many
     *
     * if the key already exists the value is added to the array otherwise a new entry is created with the value
     * wrapped in an array, if it is not an array.
     *
     * @param {String} key - the unique identifier of the what is to be retrieved.
     * @param {*} value - what is to be stored under the provided key
     *
     * @return {*}
     */
    set( key, value ){

        if( !isArray( value ) )
            value = [ value ];

        if( this.has( key ) ){
            const val = this.get( key );
            val.push.apply( val, value );
            return val;
        } else {
            super.set( key, value );
        }

        return super.get( key );
    }

    /**
     * @method set
     * @methodOf Index_many
     *
     * delete the key and its stored values from the index.
     *
     * @param {String} key - the unique identifier of the what is to be retrieved.
     */
    remove(key) {
        return super.remove(key);
    }
}