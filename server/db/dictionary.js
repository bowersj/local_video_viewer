const { isArray, isObject } = require("../../isType.js");
const { hasProperty } = require( "./utils.js" );

module.exports = {};

/**
 * @class UnsafeDictionary
 *
 * Note: this class does not check for the key name "__proto__" hence why it is unsafe.
 */
module.exports.UnsafeDictionary = class UnsafeDictionary{
    /**
     * @constructor
     * @version 1.0.1
     *
     * @param {Object} elements - an object contain the initial values of this structures.
     *
     * @return {UnsafeDictionary}
     */
    constructor( elements ){
        this.elements = elements || Object.create(null);
    }

    /**
     * @methodOf UnsafeDictionary
     * @method has
     * @version 1.0.1
     *
     * @param {String} key - the value something is stored under.
     *
     * @return {Boolean}
     */
    has( key ){
        return hasProperty.call( this.elements, key );
    }

    /**
     * @methodOf UnsafeDictionary
     * @method get
     * @version 1.0.1
     *
     * @param {String|Array|Object} key - the value something is stored under.
     * @param {Boolean} throwError - weather or not to throw an error
     *
     * @throws Error
     * @return {*}
     */
    get( key, throwError = true ){

        if( isArray( key ) ) {
            let res = [];

            for( let i = 0, l = key.length; i < l; ++i ){
                res.push( this._get( key[i], throwError ) );
            }

            return res;
        } else if( isObject( key ) ){
            let res = {};

            for( let prop in key ){
                res[ prop ] = this._get( key[prop], throwError );
            }

            return res;
        } else
            return this._get( key, throwError );
    }

    /**
     * @methodOf UnsafeDictionary
     * @method _get
     * @version 1.0.1
     *
     * @param {String} key - the value something is stored under.
     * @param {Boolean} throwError - weather or not to throw an error
     *
     * @throws Error
     * @return {*}
     */
    _get( key, throwError = true ){
        if( this.has( key ) )
            return this.elements[ key ];
        else if ( throwError )
            throw new Error( `The element, "${key}", does not exist.` );
        else
            return undefined;
    }

    /**
     * @methodOf UnsafeDictionary
     * @method set
     * @version 1.0.1
     *
     * @param {String|Object} key - the value something is stored under.
     * @param {*} value - the value something is stored under.
     *
     * @throws Error
     */
    set( key, value ){

        if( isArray( key ) ) {
            throw new Error( `The element cannot be an array.` );
        } else if( isObject( key ) ){

            for( let prop in key ){
                this._set( key, key[ prop ] )
            }

        } else
            return this._set( key, value );
    }

    /**
     * @methodOf UnsafeDictionary
     * @method _set
     * @version 1.0.1
     *
     * @param {String} key - the value something is stored under.
     * @param {*} value - the value something is stored under.
     *
     */
    _set( key, value ){
        this.elements[ key ] = value;
        return this.elements[ key ];
    }

    /**
     * @methodOf UnsafeDictionary
     * @method remove
     * @version 2.0.1
     *
     * @param {String} key - the value something is stored under.
     *
     * @return {Boolean} weather or not the value was removed from the structures.
     */
    remove( key ){
        delete this.elements[ key ];

        return !this.has( key );
    }

    /**
     * @methodOf UnsafeDictionary
     * @method getAllElements
     * @version 1.0.0
     *
     * @return {Array}
     */
    getAllElements(){
        return Object.getOwnPropertyNames(this.elements);
    }

    /**
     * @methodOf UnsafeDictionary
     * @method getAllValues
     * @version 1.0.0
     *
     * @return {Array}
     */
    getAllValues(){
        return Object.values( this.elements )
    }

    /**
     * @methodOf UnsafeDictionary
     * @method serialize
     * @version 1.0.0
     *
     * @return {Object}
     */
    serialize(){
        return JSON.parse( JSON.stringify( this.elements ) );
    }
}


/**
 * @class Dictionary
 * @extends UnsafeDictionary
 */
module.exports.Dictionary = class Dictionary {

    /**
     * @constructor
     * @version 1.0.1
     *
     * @param {Object} elements - an object contain the initial values of this structures.
     *
     * @return {Dictionary}
     */
    constructor( elements ) {
        this.elements = elements || Object.create(null);
        this.hasSpecialProto = false;
        this.specialProto = undefined;
    }

    /**
     * @methodOf Dictionary
     * @method has
     * @version 1.0.1
     *
     * @param {String} key - the value something is stored under.
     *
     * @return {Boolean}
     */
    has( key ){
        if( key === "__proto__" )
            return this.hasSpecialProto;

        return hasProperty.call( this.elements, key );
    }

    /**
     * @methodOf Dictionary
     * @method get
     * @version 1.0.1
     *
     * @param {String|Array|Object} key - the value something is stored under.
     *
     * @throws Error
     * @return {*}
     */
    get( key ){

        if( isArray( key ) ) {
            let res = [];

            for( let i = 0, l = key.length; i < l; ++i ){
                res.push( this._get( key[i] ) );
            }

            return res;
        } else if( isObject( key ) ){
            let res = {};

            for( let prop in key ){
                res[ prop ] = this._get( key[prop] );
            }

            return res;
        } else
            return this._get( key );
    }

    /**
     * @methodOf Dictionary
     * @method _get
     * @version 1.0.1
     *
     * @param {String} key - the value something is stored under.
     *
     * @throws Error
     * @return {*}
     */
    _get( key ){
        if( key === "__proto__" )
            return this.specialProto;
        if( this.has( key ) )
            return this.elements[ key ];
        else
            throw new Error( `The element, "${key}", does not exist.` );
    }

    /**
     * @methodOf Dictionary
     * @method set
     * @version 1.0.1
     *
     * @param {String|Object} key - the value something is stored under.
     * @param {*} value - the value something is stored under.
     *
     * @throws Error
     */
    set( key, value ){

        if( isArray( key ) ) {
            throw new Error( `The element cannot be an array.` );
        } else if( isObject( key ) ){

            for( let prop in key ){
                this._set( key, key[ prop ] )
            }

        } else
            return this._set( key, value );
    }

    /**
     * @methodOf Dictionary
     * @method _set
     * @version 1.0.1
     *
     * @param {String} key - the value something is stored under.
     * @param {*} value - the value something is stored under.
     *
     * @throws Error
     */
    _set( key, value ){
        if( key === "__proto__" ){
            this.specialProto = value;
            return this.specialProto;
        } else{
            this.elements[ key ] = value;
            return this.elements[ key ];
        }
    }

    /**
     * @methodOf Dictionary
     * @method remove
     * @version 2.0.1
     *
     * @param {String} key - the value something is stored under.
     *
     * @return {Boolean} weather or not the value was removed from the structures.
     */
    remove( key ){
        if( key === "__proto__" ){
            this.specialProto = undefined;
            this.hasSpecialProto = false;
        } else {
            delete this.elements[ key ];
        }

        return !this.has( key );
    }

    /**
     * @methodOf Dictionary
     * @method getAllElements
     * @version 1.0.0
     *
     * @return {Array}
     */
    getAllElements(){
        let arr = Object.getOwnPropertyNames( this.elements );
        if( this.hasSpecialProto )
            arr.push( "__proto__" );

        return arr;
    }

    /**
     * @methodOf UnsafeDictionary
     * @method serialize
     * @version 1.0.0
     *
     * @return {Object}
     */
    serialize(){
        return JSON.parse( JSON.stringify( this.elements ) );
    }
}