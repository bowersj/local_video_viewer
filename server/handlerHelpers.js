const exphbs = require("express-handlebars");
module.exports = {
    isGreaterThan1 (value) {
        return value > 1;
    },

    JSON2string( obj ) {
        return JSON.stringify(obj);
    },

    math: function(lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    },

    or:  function( lval, rval ){ return lval ||  rval; },
    and: function( lval, rval ){ return lval &&  rval; },
    eq:  function( lval, rval ){ return lval === rval; },
    ne:  function( lval, rval ){ return lval !== rval; },

    select: function( selected, options ){
        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');
    }
}