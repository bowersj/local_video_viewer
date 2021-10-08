const dtId = webix.uid();
const dtConfig = {
    id: dtId, view: "datatable", hidden: true, borderless: true,
    columns:[
        { id:"value", header:"Name", maxWidth: 800, minWidth: 200, fillspace: true,
            type: "text",
            template: "{common.folder()} <span>#value#</span>"
        },
        { id:"size",  header:"Size", maxWidth: 120, minWidth: 175, type: "int",
            template: function( obj ){
                if( obj.size )
                    return prettyPrintFileSize( obj.size );
                else
                    return "";
            }
        },
        { id:"type",  header:"Type", maxWidth: 200, minWidth: 300, type: "text" },
    ],
    on:{
        onItemClick: function( id, e, node ){
            let item = this.getItem(id);
            // console.log( "dt onItemClick" );
            // console.log( item )
            if( item.webix_kids ){
                // directory
                $$( treeId ).loadBranch( item.id )
                    .then(()=>{
                        let tree = $$( treeId );
                        let id = item.id;

                        tree.open( id );
                        tree.select( id );
                    })
                    .catch(console.error);

                displayInTable( item )
            } else {
                //file
                switch (item.type){
                    case "MP4 File":
                        viewMedia( item.id );
                        break;
                    case "JSON File":
                        dt.hide();
                        break;
                }
            }
        }
    }
};

const treeId = "fileTreeView";

webix.ui({
    cols:[
        // tree views
        {
            id: treeId,
            width: window.innerWidth * 0.25,
            scroll: "x",
            view: "tree",
            select: true,
            url: "/file_explorer/items_at_level",
            on: {
                onItemClick: function( id, e, node ){
                    this.open( id );

                    let item = this.getItem( id );
                    // console.log( "tree onItemClick" );
                    // console.log( item );

                    displayInTable( item );

                }
            }
        },
        { view:"resizer" },
        // file list/viewer
        // viewer can either display the form to edit the meta data or take
        // you to the player/viewer for the media
        { id: "displayArea",
            padding: 10, scroll: "y",
            rows:[
                // place holder
                dtConfig
            ]
        }
    ]
});

webix.ui({
    view:"contextmenu",
    id: "contextMenu",
    data:[
        "View Media",
        { $template:"Separator" },
        "Edit Data"
    ],
    on:{
        onBeforeShow: function (){
            const context = this.getContext();
            const view = context.obj.config.view;

            let item = {};

            switch ( view ){
                case "datatable":
                    item = $$( dtId ).getItem( context.id.row );
                    break;
                case "tree":
                    item = $$( treeId ).getItem( context.id );
                    break;
            }



            return item.type !== "Directory";

            // if(  ){
            //     this.hideItem("View Media");
            //     this.hideItem("Edit Data");
            // } else {
            //     this.showItem("View Media");
            //     this.showItem("Edit Data");
            // }

            // console.log( this.getBody() );
            // console.log( context );
        },
        onMenuItemClick: function(id){
            const context = this.getContext();
            const view = context.obj.config.view;

            let filePath = "";

            switch ( view ){
                case "datatable":
                    filePath = context.id.row;
                    break;
                case "tree":
                    filePath = context.id;
                    break;
            }

            switch( id ){
                case "View Media":
                    viewMedia( filePath );
                    break;
                case "Edit Data":
                    break;
            }
            // console.log( id );
            // console.log( context );
            // console.log( filePath );
        }
    }
});

$$( "contextMenu" ).attachTo( $$( dtId ) )
$$( "contextMenu" ).attachTo( $$( treeId ) )

function displayInTable( item ){
    let dt = $$( dtId );

    console.log( item.type );

    switch (item.type){
        case "Directory":
            webix.ajax().get(`/file_explorer/detailed_items?parent=${item.id}`)
                .then(( data )=>{
                    // === replace current view ===
                    // let id = webix.uid();
                    // let conf = webix.copy( dtConfig );
                    // conf.id = id;

                    // webix.ui( conf, da.getChildViews()[0]);

                    // let dt = $$( id );


                    // === update view ===
                    dt.clearAll();
                    dt.parse( data.json() );
                    dt.sort([
                        { by: "type" },
                        { by: "value" },
                    ])
                    dt.show();
                })
                .catch(console.error)
            break;
        case "MP4 File":
            viewMedia( item.id );
            break;
        case "JSON File":
            dt.hide();
            break;
    }
}

function prettyPrintFileSize( bytes ){
    if( bytes < 1024 ){
        return bytes.toLocaleString() + " B";
    } else if ( bytes < 1048576 ){
        return Math.ceil(bytes / 1024).toLocaleString() + " KB";
    } else if ( bytes < 1073741824 ){
        return Math.ceil(bytes / 1048576).toLocaleString() + " MB";
    }
}

function viewMedia( filePath ){
    window.location = `/watch_from_file?path=${filePath}&autoStart=true`;
}