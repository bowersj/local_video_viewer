const fs = require("fs");
const express = require( "express" );
const routeFor = require( "./../route.js" );

const { getSeries} = require( "./../controllers/utils.js" );
const {v4: uuidv4} = require("uuid");
const {saveSeries} = require("../controllers/editSeries.js");

const router = express.Router();

router.get( routeFor.editSeries, ( req, res )=>{
    let opts = {
        formName: "Series",
        layout: "form.hbs",
        script: [
            { src: "./JS/form-series.js" },
        ]
    };

    res.render( "webix.hbs", opts );
});

router.get( routeFor.seriesData, ( req, res )=>{
    let data = {};
    try { data = getSeries( req ); } catch ( error ){ data = { seriesId: uuidv4() }; }
    res.json( data );
});

router.post( routeFor.saveSeries, saveSeries );

module.exports = router;