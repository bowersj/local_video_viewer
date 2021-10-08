const fs = require("fs");
const fsp = fs.promises;
const path = require( "path" );
const express = require( "express" );
const mime = require("mime-types");

const routeFor = require( "./../route.js" );
const _ = require("./../../isType.js");

const toRoot = "./" + __dirname.split( path.sep ).slice( 1 ).map( node => ".." ).join( "/" );
const { mediaRoot } = require( "./../../constants.js" );
const root = path.resolve( path.join( toRoot, mediaRoot ) );

const router = express.Router();



router.get( routeFor.fileExplorer, ( req, res )=>{
    let opts = {
        title: "File Explorer",
        layout: "form.hbs",
        script: [
            { src: "./JS/fileExplorer.js" },
        ]
    };

    res.render( "webix.hbs", opts );
});

router.get( routeFor.filesAtLevel, ( req, res )=>{
    const explore = req.query || {};
    let noParams = false;
    if( _.isNull( explore.parent ) ){
        explore.parent = root;
        noParams = true;
    }
    const parent = explore.parent;
    const dir = path.resolve( parent );
    let contents = [];

    fsp.readdir( dir )
        .then(( data )=>{
            data.map( fileName =>{
                let id = path.join( dir, fileName );
                let item = fs.statSync( id );
                let isDir = item.isDirectory();
                let type = "";

                if( isDir ){
                    type = "Directory"
                } else {
                    type = path.extname( id ).replace( ".", "" ).toUpperCase() + " File";
                }
                contents.push({ id, value: fileName, webix_kids: isDir, type, });
            });
            // console.log( contents );
            if( noParams ){
                res.json( contents );
            } else {
                res.json({ parent: dir, data: contents });
            }
        })
        .catch((err)=>{
            console.error( err );
            res.status( 500 ).send( "Internal server error" );
        });
});

router.get( routeFor.detailItems, ( req, res )=>{
    const explore = req.query || {};

    if( _.isNull( explore.parent ) ){
        explore.parent = root;
    }

    const parent = explore.parent;
    const dir = path.resolve( parent );
    let contents = [];

    fsp.readdir( dir )
        .then(( data )=>{
            data.map( fileName =>{
                let id = path.join( dir, fileName );
                let item = fs.statSync( id );
                let isDir = item.isDirectory();
                let type = "";

                if( isDir ){
                    type = "Directory"
                } else {
                    type = path.extname( id ).replace( ".", "" ).toUpperCase() + " File";
                }

                contents.push({ id,
                    value: fileName,
                    webix_kids: isDir,
                    size: item.size,
                    type
                });
            });

            res.json( contents );
        })
        .catch((err)=>{
            console.error( err );
            res.status( 500 ).send( "Internal server error" );
        });
});



module.exports = router;

function comparator(a,b){
    return b.value - a.value
}