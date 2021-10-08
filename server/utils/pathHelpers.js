// All absolute paths start with the drive Letter
const path = require("path");
const fs = require("fs");

const { currentDrive } = require( "./../../constants.js" );

const isLetter = /[a-zA-Z]/g

function isRelativePath( p ){
    const fChar = p.charAt(0);
    return !isLetter.test( fChar );
}

function pathExists( p ){

    if( isRelativePath( p ) ){
        p = path.join( currentDrive, p );
    }

    let stat = {};

    try {
        stat = fs.statSync( p );
    } catch ( error ){
        // console.error( error );
        return error.code !== "ENOENT";
    }

    return stat.isFile() || stat.isDirectory();
}


module.exports = {
    isRelativePath, pathExists
}


// console.log( pathExists( "E:\\server\\server\\db\\data\\_merlin_mediaPlayerData.json" ) )