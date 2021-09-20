const exphbs = require("express-handlebars");
module.exports = {
    isGreaterThan1 (value) {
        return value > 1;
    },

    JSON2string( obj ) {
        return JSON.stringify(obj);
    }
};