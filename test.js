const mime = require( "./server/node_modules/mime-types" );
console.log( mime.lookup( ".jpeg" ) )
console.log( mime.lookup( ".png" ) )