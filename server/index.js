const fs = require("fs");
const path = require( "path" );

const { v4: uuidv4 } = require( "uuid" );
const mime = require('mime-types')
const express = require("express");
var bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const _ = require( "./../isType.js" )
const { getSeriesData } = require( "./controllers/utils.js" )

const port = 3000;
const app = express();


const routeFor = require( "./route.js" );


app.use(express.static(path.join( __dirname, "./public" )));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded


app.engine('hbs', exphbs({
    partialsDir:  __dirname + "/views/partials/",
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require( "./handlerHelpers.js" )
}));


app.set('view engine', 'hbs');


// routes
app.use( "/", require( "./routes/editEpisode.js" ) )
app.use( "/", require( "./routes/editSeries.js" ) )
app.use( "/", require( "./routes/view.js" ) )

app.get( routeFor.home, (req, res) => {
    res.render('series', { layout: "grid.hbs", menu:{ series: false }, series: getSeriesData() });
});

app.listen(port, () => {
    console.log('The web server has started on port ' + port);
});