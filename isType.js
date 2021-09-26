module.exports = {
    /**
     * ====================================================================================================================
     * ================================================= String Functions =================================================
     * ====================================================================================================================
     */
    isString( str ){
        return typeof str === 'string' && !this.isEmptyString( str );
    },

    isEmptyString( str ){
        return str === "";
    },
    
    
    
    /**
     * ====================================================================================================================
     * ============================================ Nullable String Functions =============================================
     * ====================================================================================================================
     */
    isStringOrNull (str ){
        return typeof str === 'string' || this.isNull( str ) || str === "";
    },
    
    
    /**
     * ====================================================================================================================
     * ================================================ Special Functions =================================================
     * ====================================================================================================================
     */
    isNan (value) {
        // Do not rename to isNaN
        return value !== value;
    },
    
    
    isZero (value) {
        return value === 0;
    },
    
    
    isInfinity (value) {
        return value === -Infinity || value === Infinity;
    },
    
    
    isPositiveInfinity (value) {
        return value === Infinity;
    },
    
    
    isNegativeInfinity (value) {
        return value === -Infinity;
    },
    
    
    isNumberOrInfinity (value) {
        // must be a simple number type, or Infinity, or -Infinity, and not NaN
        return typeof value === 'number'  && !this.isNan(value);
    },
    
    
    isNumberOrNegativeInfinity (value) {
        // must be a simple number type or -Infinity, and not NaN
        return ( typeof value === 'number' || value === -Infinity ) && !this.isNan(value) && value !== Infinity;
    },
    
    
    isNumberOrPositiveInfinity (value) {
        // must be a simple number type or +Infinity and not NaN
        return ( typeof value === 'number' || value === Infinity ) && !this.isNan(value) && value !== -Infinity;
    },
    
    
    /**
     * ====================================================================================================================
     * =================================================== Safe Number ====================================================
     * ====================================================================================================================
     */
    isNumber (num) {
        return typeof num === 'number' && num > -Infinity && num < Infinity && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isNumberEqual (num1, num2) {
        return this.isNumber(num1) && this.isNumber(num2) && num1 === num2;
    },
    
    
    isNumberGreater (greaterNum, lesserNum) {
        return this.isNumber(greaterNum) && this.isNumber(lesserNum) && greaterNum > lesserNum;
    },
    
    
    isNumberGreaterOrEqual (greaterOrEqualNum, lesserOrEqualNum) {
        return this.isNumber(greaterOrEqualNum) && this.isNumber(lesserOrEqualNum) && greaterOrEqualNum >= lesserOrEqualNum;
    },
    
    
    isNumberLess (lesserNum, greaterNum) {
        return this.isNumber(lesserNum) && this.isNumber(greaterNum) && lesserNum < greaterNum;
    },
    
    
    isNumberLessOrEqual (lesserOrEqualNum, greaterOrEqualNum) {
        return this.isNumber(lesserOrEqualNum) && this.isNumber(greaterOrEqualNum) && lesserOrEqualNum <= greaterOrEqualNum;
    },
    
    
    isNumberBetween (num, lowNumExclusive, highNumExclusive) {
        if ( this.isNumber(num) && this.isNumber(lowNumExclusive) && this.isNumber(highNumExclusive) && lowNumExclusive < num && highNumExclusive > num) { return true; }
        return false;
    },
    
    
    isNumberInRange (num, lowNumInclusive, highNumInclusive) {
        if ( this.isNumber(num) && this.isNumber(lowNumInclusive) && this.isNumber(highNumInclusive) && lowNumInclusive <= num && highNumInclusive >= num) { return true; }
        return false;
    },
    
    
    isNumberPositive (num) {
        return typeof num === 'number' && num < Infinity && num > 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isNumberNegative (num) {
        return typeof num === 'number' && num > -Infinity && num < 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    
    
    /**
     * ====================================================================================================================
     * =================================================== Safe Integer ===================================================
     * ====================================================================================================================
     */
    isInteger (int) {
        return Number.isInteger(int) && Number.isSafeInteger(int);
    },
    
    
    isIntegerEqual (num1, num2) {
        return Number.isInteger(num1) && Number.isSafeInteger(num1) && Number.isInteger(num2) && Number.isSafeInteger(num2) && num1 === num2
    },
    
    
    isIntegerPositive (int) {
        // integer > 0 and not NaN, Infinity, -Infinity
        return Number.isInteger(int) && Number.isSafeInteger(int) && int > 0;
    },
    
    
    isIntegerZeroOrPositive (int) {
        // integer >= 0 and not NaN, Infinity, -Infinity
        return Number.isInteger(int) && Number.isSafeInteger(int) && int >= 0;
    },
    
    
    isIntegerNegative (int) {
        // integer < 0 and not NaN, Infinity, -Infinity
        return Number.isInteger(int) && Number.isSafeInteger(int) && int < 0;
    },
    
    
    isIntegerZeroOrNegative (int) {
        // integer <= 0 and not NaN, Infinity, -Infinity
        return Number.isInteger(int) && Number.isSafeInteger(int) && int <= 0;
    },
    
    
    isIntegerOdd (int) {
        return Number.isInteger(int) && Number.isSafeInteger(int) && int % 2 !== 0;  //there are no odd floating point numbers
    },
    
    isIntegerEven (int) {
        return Number.isInteger(int) && Number.isSafeInteger(int) && int % 2 === 0; //there are no even floating point numbers
    },
    
    isIntegerBetween(int, lowIntExclusive, highIntExclusive){
        if(Number.isInteger(int) && int > lowIntExclusive && int < highIntExclusive && Number.isSafeInteger(int) && Number.isSafeInteger(lowIntExclusive) && Number.isSafeInteger(highIntExclusive)) { return true; }
        return false;
    },
    
    isIntegerInRange(int, lowIntInclusive, highIntInclusive){
        if(Number.isInteger(int) && int >= lowIntInclusive && int <= highIntInclusive && Number.isSafeInteger(int) && Number.isSafeInteger(lowIntInclusive) && Number.isSafeInteger(highIntInclusive)) { return true; }
        return false;
    },
    
    isIntegerLess(int, highIntExclusive){
        if(Number.isInteger(int) && int < highIntExclusive && Number.isSafeInteger(int) && Number.isSafeInteger(highIntExclusive) ) { return true; }
        return false;
    },
    
    isIntegerLessOrEqual(int, highIntInclusive){
        if(Number.isInteger(int) && int <= highIntInclusive && Number.isSafeInteger(int) && Number.isSafeInteger(highIntInclusive) ) { return true; }
        return false;
    },
    
    isIntegerGreater(int, lowIntExclusive){
        if(Number.isInteger(int) && int > lowIntExclusive && Number.isSafeInteger(int) && Number.isSafeInteger(lowIntExclusive) ) { return true; }
        return false;
    },
    
    isIntegerGreaterOrEqual(int, lowIntInclusive){
        if(Number.isInteger(int) && int >= lowIntInclusive && Number.isSafeInteger(int) && Number.isSafeInteger(lowIntInclusive)) { return true; }
        return false;
    },
    
    
    isIntegerOrInfinity (value) {
        return Number.isInteger(value) || value === Infinity || value === -Infinity;
    },
    
    isIntegerOrNegativeInfinity (value) {
        return Number.isInteger(value) || value === -Infinity;
    },
    
    isIntegerOrPositiveInfinity (value) {
        return Number.isInteger(value) || value === Infinity;
    },
    
    
    /**
     * ====================================================================================================================
     * ======================================================= Misc =======================================================
     * ====================================================================================================================
     */
    /**
     * this is to handle integers, weather the type is an integer, float, or double.
     *
     */
    ifIntegerThenSafeInteger( num ){
        if( Number.isInteger( num ) ) { return Number.isSafeInteger( num ) }
        return true;
    },
    
    /**
     * The difference between this and the one above is that it returns true for values
     * that are in exponential form.
     */
    ifIntegerThenSafeInteger_floatingPoint( num ){
        if( Number.isInteger( num ) && num.toExponential() !== num.toString() ) { return Number.isSafeInteger( num ) }
        return true;
    },
    
    isEqual (v1, v2) {
        // NaN equals NaN
        // 0 equals 0, -0, +0
        // Objects, Arrays, and functions are equal only if they reference the same object -- even if they have identical values.
    
        if ( this.isNan( v1 ) ) return this.isNan( v2 );
        return v1 === v2
    },
    
    isDeepEqual ( v1, v2 ) {
        if ( this.isEqual(v1, v2) ) return true;
        if (v1 === undefined || v2 === undefined) return false;
        if (v1 === null || v2 === null) return false;
    
        let v1ConstructorName = v1.constructor.name;
        if (v1ConstructorName === v2.constructor.name) {
            switch (v1ConstructorName){
                case 'Number' :
                    if ( this.isNan(v1.valueOf()) ) return this.isNan(v2.valueOf());
                    return v1.valueOf() === v2.valueOf();
                case 'Boolean' :
                    return v1.valueOf() === v2.valueOf();
                case 'function' :
                    return v1.toString() === v2.toString();
                case 'RegExp' :
                    return v1.toString() === v2.toString();
                case 'String' :  //comparing strings and new String()
                    return v1 === v2;
                case 'Symbol' :
                    return v1 === v2;
                default: //object, array, Date, etc.
                    return JSON.stringify(v1) === JSON.stringify(v2)
            }
        }
        return false
    },
    
    isObject ( value ) {
        //true for object only -- false for array, function, class, or simple type
        return ( value !== null && typeof value === 'object' && value.constructor.name === 'Object' );
    },
    
    
    isObjectWith ( value, param=[] ){
        let len = param.length;
    
        if( len === 0 ) return true;
    
        if( this.isObject( value ) ){
            for( let i = 0; i < len; ++i ){
                if( value[ param[i] ] === undefined ) return false;
            }
        }
        else return false;
    
        return true;
    },
    
    isClass ( value ) {
        //true only for objects created from a class
        return ( value !== null && typeof value === 'object' && value.constructor.toString().substring(0, 5) === 'class' );
    },
    
    
    isArray (value) {
        return Array.isArray(value);
    },
    
    
    isFunction (value) {
        return typeof value === 'function';
    },
    
    // this is mostly for internal use and proper error messages
    isUndefined (value) {
        return value === undefined;
    },
    
    // Recall, we defined the undefined type to be the same as the null type hence there is no isUndefined function
    // Since an empty sting is a physical concept but has no logical differences from null, an empty string is
    // considered null
    isNull (value) {
        return value === null || this.isUndefined( value )
    },
    
    
    isBoolean(boo){
        return typeof boo === 'boolean'
    },
    
    
    
    /**
     * ====================================================================================================================
     * =================================================== Safe Double ====================================================
     * ====================================================================================================================
     */
    isDouble (num) {
        return typeof num === 'number' && num === num && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isDoubleEqual (num1, num2) {
        return typeof num1 === 'number' && typeof num2 === 'number' && num1 === num2 && this.ifIntegerThenSafeInteger_floatingPoint(num1) && this.ifIntegerThenSafeInteger_floatingPoint(num2);
    },
    
    
    isDoubleGreater (greaterNum, lesserNum) {
        return this.isDouble(greaterNum) && this.isDouble(lesserNum) && greaterNum > lesserNum;
    },
    
    
    isDoubleGreaterOrEqual (greaterOrEqualNum, lesserOrEqualNum) {
        return this.isDouble(greaterOrEqualNum) &&  this.isDouble(lesserOrEqualNum) && greaterOrEqualNum >= lesserOrEqualNum;
    },
    
    
    isDoubleLess (lesserNum, greaterNum) {
        return this.isDouble(lesserNum) && this.isDouble(greaterNum) && lesserNum < greaterNum;
    },
    
    
    isDoubleLessOrEqual (lesserOrEqualNum, greaterOrEqualNum) {
        return this.isDouble(lesserOrEqualNum) && this.isDouble(greaterOrEqualNum) &&  lesserOrEqualNum <= greaterOrEqualNum;
    },
    
    
    isDoubleBetween (num, lowNumExclusive, highNumExclusive) {
        if ( this.isDouble(num) && this.isDouble(lowNumExclusive) && this.isDouble(highNumExclusive) && lowNumExclusive < num && highNumExclusive > num) { return true; }
        return false;
    },
    
    
    isDoubleInRange (num, lowNumInclusive, highNumInclusive) {
        if (
               typeof num === 'number'
            && typeof lowNumInclusive === 'number'
            && typeof highNumInclusive === 'number'
            && lowNumInclusive <= num && highNumInclusive >= num
            && this.ifIntegerThenSafeInteger_floatingPoint(num)
            && this.ifIntegerThenSafeInteger_floatingPoint(lowNumInclusive)
            && this.ifIntegerThenSafeInteger_floatingPoint(highNumInclusive)
        ){ return true; }
        return false;
    },
    
    
    isDoublePositive (num) {
        return typeof num === 'number' && num > 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isDoubleNegative (num) {
        return typeof num === 'number' && num < 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    isNegativeZero( value ){
        return Object.is( value, -0 );
    },
    
    
    
    /**
     * ====================================================================================================================
     * ============================================= Nullable Special Number ==============================================
     * ====================================================================================================================
     */
    isNanOrNull (value) {
        // Do not rename to isNaN
        return value === null || value !== value;
    },
    
    
    isZeroOrNull (value) {
        return value === null || value === 0;
    },
    
    
    isInfinityOrNull (value) {
        return value === null || value === -Infinity || value === Infinity;
    },
    
    
    isPositiveInfinityOrNull (value) {
        return value === null || value === Infinity;
    },
    
    
    isNegativeInfinityOrNull (value) {
        return value === null || value === -Infinity;
    },
    
    
    isNumberOrInfinityOrNull (value) {
        // must be a simple number type, or Infinity, or -Infinity, and not NaN
        return value === null || typeof value === 'number'  && !this.isNan(value);
    },
    
    
    isNumberOrNegativeInfinityOrNull (value) {
        // must be a simple number type or -Infinity, and not NaN
        return value === null || ( ( typeof value === 'number' || value === -Infinity ) && !this.isNan(value) && value !== Infinity );
    },
    
    
    isNumberOrPositiveInfinityOrNull (value) {
        // must be a simple number type or +Infinity and not NaN
        return value === null || ( ( typeof value === 'number' || value === Infinity ) && !this.isNan(value) && value !== -Infinity );
    },
    
    
    
    
    /**
     * ====================================================================================================================
     * ================================================= Nullable Number ==================================================
     * ====================================================================================================================
     */
    isNumberOrNull (num) {
        if(num === null){ return true; }
        return typeof num === 'number' && num > -Infinity && num < Infinity && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isNumberEqualOrNull (num1, num2) {
        if( num1 === null || num2 === null ){ return true; }
        return this.isNumber(num1) && this.isNumber(num2) && num1 === num2;
    },
    
    
    isNumberGreaterOrNull (greaterNum, lesserNum) {
        if( greaterNum === null || lesserNum === null ){ return true; }
        return this.isNumber(greaterNum) && this.isNumber(lesserNum) && greaterNum > lesserNum;
    },
    
    
    isNumberGreaterOrEqualOrNull (greaterOrEqualNum, lesserOrEqualNum) {
        if( greaterOrEqualNum === null || lesserOrEqualNum === null ){ return true; }
        return this.isNumber(greaterOrEqualNum) && this.isNumber(lesserOrEqualNum) && greaterOrEqualNum >= lesserOrEqualNum;
    },
    
    
    isNumberLessOrNull (lesserNum, greaterNum) {
        if( lesserNum === null || greaterNum === null ){ return true; }
        return this.isNumber(lesserNum) && this.isNumber(greaterNum) && lesserNum < greaterNum;
    },
    
    
    isNumberLessOrEqualOrNull (lesserOrEqualNum, greaterOrEqualNum) {
        if( lesserOrEqualNum === null || greaterOrEqualNum === null ){ return true; }
        return this.isNumber(lesserOrEqualNum) && this.isNumber(greaterOrEqualNum) && lesserOrEqualNum <= greaterOrEqualNum;
    },
    
    
    isNumberBetweenOrNull (num, lowNumExclusive, highNumExclusive) {
        if( num === null || lowNumExclusive === null || highNumExclusive === null ){ return true; }
        return this.isNumber(num) && this.isNumber(lowNumExclusive) && this.isNumber(highNumExclusive) && lowNumExclusive < num && highNumExclusive > num
    },
    
    
    isNumberInRangeOrNull (num, lowNumInclusive, highNumInclusive) {
        if( num === null || lowNumInclusive === null || highNumInclusive === null ){ return true; }
        return this.isNumber(num) && this.isNumber(lowNumInclusive) && this.isNumber(highNumInclusive) && lowNumInclusive <= num && highNumInclusive >= num
    },
    
    
    isNumberPositiveOrNull (num) {
        if( num === null ){ return true; }
        return typeof num === 'number' && num < Infinity && num > 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isNumberNegativeOrNull (num) {
        if( num === null ){ return true; }
        return typeof num === 'number' && num > -Infinity && num < 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    
    /**
     * ====================================================================================================================
     * ================================================== Nullable Misc ===================================================
     * ====================================================================================================================
     */
    isObjectOrNull (value) {
        //true for object only -- false for array, function, class, or simple type except null
        return ( this.isNull( value ) || typeof value === 'object' && value.constructor.name === 'Object' );
    },
    
    
    isClassOrNull (value) {
        //true only for objects created from a class
        return ( this.isNull( value ) || typeof value === 'object' && value.constructor.toString().substring(0, 5) === 'class' );
    },
    
    
    isArrayOrNull (value) {
        return  this.isNull( value ) || Array.isArray(value);
    },
    
    
    isFunctionOrNull (value) {
        return this.isNull( value ) || typeof value === 'function';
    },
    
    
    isBooleanOrNull(boo){
        if( this.isNull( boo ) ){ return true; }
        return typeof boo === 'boolean'
    },
    
    
    
    
    /**
     * ====================================================================================================================
     * ================================================= Nullable Integer =================================================
     * ====================================================================================================================
     */
    isIntegerOrNull (int) {
        if( this.isNull( int ) ){ return true; }
        return Number.isInteger(int) && Number.isSafeInteger(int);
    },
    
    
    isIntegerEqualOrNull (num1, num2) {
        if( this.isNull( num1 ) || this.isNull( num2 ) ){return true}
        return Number.isInteger(num1) && Number.isSafeInteger(num1) && Number.isInteger(num2) && Number.isSafeInteger(num2) && num1 === num2
    },
    
    
    isIntegerPositiveOrNull (int) {
        // integer > 0 and not NaN, Infinity, -Infinity
        if( this.isNull( int ) ){ return true; }
        return Number.isInteger(int) && Number.isSafeInteger(int) && int > 0;
    },
    
    
    isIntegerZeroOrPositiveOrNull (int) {
        // integer >= 0 and not NaN, Infinity, -Infinity
        if( this.isNull( int ) ){ return true; }
        return Number.isInteger(int) && Number.isSafeInteger(int) && int >= 0;
    },
    
    
    isIntegerNegativeOrNull (int) {
        // integer < 0 and not NaN, Infinity, -Infinity
        if( this.isNull( int ) ){ return true; }
        return Number.isInteger(int) && Number.isSafeInteger(int) && int < 0;
    },
    
    
    isIntegerZeroOrNegativeOrNull (int) {
        // integer <= 0 and not NaN, Infinity, -Infinity
        if( this.isNull( int ) ){ return true; }
        return Number.isInteger(int) && Number.isSafeInteger(int) && int <= 0;
    },
    
    
    isIntegerOddOrNull (int) {
        if( this.isNull( int ) ){ return true; }
        return Number.isInteger(int) && Number.isSafeInteger(int) && int % 2 !== 0;  // null % 2 = 0
    },
    
    isIntegerEvenOrNull (int) {
        if( this.isNull( int ) ){ return true; }
        return Number.isInteger(int) && Number.isSafeInteger(int) && int % 2 === 0
    },
    
    isIntegerBetweenOrNull(int, lowIntExclusive, highIntExclusive){
        if( this.isNull( int ) || this.isNull( lowIntExclusive ) || this.isNull( highIntExclusive ) ){ return true; }
        if( Number.isInteger(int) && int > lowIntExclusive && int < highIntExclusive && Number.isSafeInteger(int) && Number.isSafeInteger(lowIntExclusive) && Number.isSafeInteger(highIntExclusive) ) { return true; }
        return false;
    },
    
    isIntegerInRangeOrNull(int, lowIntInclusive, highIntInclusive){
        if( this.isNull( int ) || this.isNull( lowIntInclusive ) || this.isNull( highIntInclusive ) ){ return true; }
        if( Number.isInteger(int) && int >= lowIntInclusive && int <= highIntInclusive && Number.isSafeInteger(int) && Number.isSafeInteger(lowIntInclusive) && Number.isSafeInteger(highIntInclusive) ) { return true; }
        return false;
    },
    
    
    
    
    /**
     * ====================================================================================================================
     * ================================================= Nullable Double =================================================
     * ====================================================================================================================
     */
    isDoubleOrNull (num) {
        if( this.isNull( num ) ){ return true; }
        return typeof num === 'number' && num === num && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isDoubleEqualOrNull (num1, num2) {
        if( this.isNull( num1 ) || this.isNull( num2 ) ){ return true; }
        return typeof num1 === 'number' && typeof num2 === 'number' && num1 === num2 && this.ifIntegerThenSafeInteger_floatingPoint(num1) && this.ifIntegerThenSafeInteger_floatingPoint(num2);
    },
    
    
    isDoubleGreaterThanOrNull (greaterNum, lesserNum) {
        if( this.isNull( greaterNum ) || this.isNull( lesserNum ) ){ return true; }
        if( this.isDouble(greaterNum) && this.isDouble(lesserNum) && greaterNum > lesserNum ){ return true; }
        return false;
    },
    
    
    isDoubleGreaterThanOrEqualOrNull (greaterOrEqualNum, lesserOrEqualNum) {
        if ( this.isNull( greaterOrEqualNum )  || this.isNull( lesserOrEqualNum ) ) { return true; }
        if( this.isDouble(greaterOrEqualNum) &&  this.isDouble(lesserOrEqualNum) ){ return greaterOrEqualNum >= lesserOrEqualNum }
        return false;
    },
    
    
    isDoubleLessOrNull (lesserNum, greaterNum) {
        if ( this.isNull( lesserNum ) || this.isNull( greaterNum ) ) { return true; }
        return this.isDouble(lesserNum) && this.isDouble(greaterNum) && lesserNum < greaterNum;
    },
    
    
    isDoubleLessOrEqualOrNull (lesserOrEqualNum, greaterOrEqualNum) {
        if ( this.isNull( lesserOrEqualNum ) || this.isNull( greaterOrEqualNum ) ) { return true; }
        return this.isDouble(lesserOrEqualNum) && this.isDouble(greaterOrEqualNum) &&  lesserOrEqualNum <= greaterOrEqualNum;
    },
    
    
    isDoubleBetweenOrNull (num, lowNumExclusive, highNumExclusive) {
        if ( this.isNull( num ) || this.isNull( lowNumExclusive ) || this.isNull( highNumExclusive ) ) { return true; }
        if (
               typeof num === 'number'
            && typeof lowNumExclusive === 'number'
            && typeof highNumExclusive === 'number'
            && lowNumExclusive <= num && highNumExclusive >= num
            && this.ifIntegerThenSafeInteger_floatingPoint(num)
            && this.ifIntegerThenSafeInteger_floatingPoint(lowNumExclusive)
            && this.ifIntegerThenSafeInteger_floatingPoint(highNumExclusive)
        ) { return true; }
        return false;
    
    },
    
    
    isDoubleInRangeOrNull (num, lowNumInclusive, highNumInclusive) {
        if ( this.isNull( num ) || this.isNull( lowNumInclusive ) || this.isNull( highNumInclusive ) ) { return true; }
        if (
               typeof num === 'number'
            && typeof lowNumInclusive === 'number'
            && typeof highNumInclusive === 'number'
            && lowNumInclusive <= num
            && highNumInclusive >= num
            && this.ifIntegerThenSafeInteger_floatingPoint(num)
            && this.ifIntegerThenSafeInteger_floatingPoint(lowNumInclusive)
            && this.ifIntegerThenSafeInteger_floatingPoint(highNumInclusive)
        ) { return true; }
        return false;
    },
    
    
    isDoublePositiveOrNull (num) {
        if( this.isNull(  num ) ){ return true; }
        return typeof num === 'number' && num > 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
    
    
    isDoubleNegativeOrNull (num) {
        if( this.isNull( num ) ){ return true; }
        return typeof num === 'number' && num < 0 && this.ifIntegerThenSafeInteger_floatingPoint(num);
    },
};