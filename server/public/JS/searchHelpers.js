const epContainer = $( "#episodeListContainer" )
const episode = epContainer.children();
const docs = epContainer.data( "episodes" );

const idx = lunr(function () {
    // assume flat objects
    this.ref( 'ID' )

    let props = Object.getOwnPropertyNames(
        docs.reduce( function( acc, data ){

            let ps = Object.getOwnPropertyNames( data );

            for( let i = 0, l = ps.length; i < l; ++i ){
                if( !acc[ ps[i] ] )
                    acc[ ps[i] ] = true;
            }

            return acc;
        }, {})
    );

    for( let i = 0, l = props.length; i < l; ++i ){
        this.field( props[i] );
    }

    docs.forEach(function (doc) {
        this.add(doc)
    }, this)
});

$( "#searchInput" ).change( function(){
    const resMap = idx.search( this.value ).reduce( ( acc, result ) => {
        acc[ result.ref ] = true;
        return acc;
    }, Object.create( null ) );

    episode.each(function( idx, ep ){
        let ep1 = $( ep );
        if( !resMap[ ep1.data( "episodeId" ) ] )
            ep1.addClass( "hidden" );
        else
            ep1.removeClass( "hidden" );
    });
})