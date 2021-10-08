const express = require( "express" );

const routeFor = require( "./../route.js" );
const { getEpisodeData, getSeries } = require( "./../controllers/utils.js" );
const { saveEpisode, deleteEpisode } = require( "../controllers/editEpisode.js" );
const db = require("./../db/db.js");
const err = require( "./../errorHandler.js" );

const router = express.Router();


router.get( routeFor.series, ( req, res )=>{
   try {
       res.json( db.seriesData().map( series => {
           return { id: series.seriesId, value: series.series, select: true }
       }) );
   } catch ( error ){
       console.error( error );
   }
});

router.get( routeFor.editEpisode, ( req, res )=>{
    let opts = {
        formName: "Episode",
        layout: "form.hbs",
        script: [
            { src: "./JS/form-episode.js" },
        ]
    };
    res.render( "webix.hbs", opts );
});

router.get( routeFor.episodeData, ( req, res )=>{
    let data = {};

    try {
        // logs error when adding new episode, need to not show error since its expected...
        data = getEpisodeData( req );
    } catch ( error ){
        // err.handler( error );
        // default values
        data = { seriesId: "", series: "", number: 1, season: 1, raters: 0, rating: 0, };
    }
    res.json( data );
});

router.post( routeFor.saveEpisode, saveEpisode );
router.post( routeFor.deleteEpisode, deleteEpisode );


module.exports = router;