const express = require( "express" );
const {v4: uuidv4} = require("uuid");

const routeFor = require( "./../route.js" );
const { getEpisodeData, getSeriesData, getSeries } = require( "./../controllers/utils.js" );
const { saveEpisode } = require( "./../controllers/edit.js" );

const router = express.Router();


router.get( routeFor.series, ( req, res )=>{
   try {
       res.json( getSeriesData().map( series => {
           return { id: series.seriesId, value: series.series }
       }) );
   } catch ( error ){
       console.error( error );
   }
});

router.get( routeFor.editEpisode, ( req, res )=>{
    let opts = {};
    opts.layout = "form.hbs";
    opts.script = [
        { src: "./JS/form-episode.js" },
    ];
    res.render( "form-episode.hbs", opts );
});

router.get( routeFor.episodeData, ( req, res )=>{
    let data = {};

    try {
        data = getEpisodeData( req );
    } catch ( error ){
        let ser = getSeries( req );
        // default values
        data = {
            ID: uuidv4(), seriesId: ser.seriesId, series: ser.series,
            number: 1, season: 1
        };
    }
    res.json( data );
});

router.post( routeFor.saveEpisode, saveEpisode );


module.exports = router;