const path = require("path");
const fs = require("fs");

const isLetter = /[a-zA-Z]/g

// All absolute paths start with the drive Letter
function isRelativePath( p ){
    const fChar = p.charAt(0);
    return !isLetter.test( fChar );
}

function pathExists( p ){
    if( isRelativePath( p ) ){
        p = path.resolve( p );
    }

    console.log( p );

    let stat = {};

    try {
        stat = fs.statSync( p );
    } catch ( error ){
        // console.error( error );
        return error.code !== "ENOENT";
    }

    return stat.isFile();
}

console.log( pathExists( "E:\\Media\\TV_Serries\\Castle\\season 01\\E101_Flowers for Your Grave.mp4" ) )