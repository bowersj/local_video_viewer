const { EventEmitter } = require( "events" );
const { v4:uuidv4 } = require( "uuid" );


class Event extends EventEmitter {

    constructor( name ) {
        super();

        this._blockAllEvents = false;
        this._name = name;
        this.id = uuidv4();
    }

    on( eventId, fn ){
        super.on( eventId, fn );
    }

    emit( eventId, data ){
        if( this._blockAllEvents ){
            super.emit( "error", { msg: "No events can fire at this time.", eventId, data }, this );
        }

        super.emit( eventId, data );
    }

    blockEvents(){ this._blockAllEvents = true; }

    unblockEvents(){ this._blockAllEvents = false; }
}





module.exports = { Event };