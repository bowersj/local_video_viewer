module.exports = {
    handler: function( error, res, statusNum, msg ){
        console.error( error );

        if( res && res.status ){

            if( !statusNum )
                statusNum = 500;

            if( !msg )
                msg = "Something went wrong...";

            res.status( statusNum ).send( msg );
        }
    }
};