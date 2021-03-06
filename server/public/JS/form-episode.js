let actionsRow = {
    cols:[
        {},
        { view: "button", value: "Save", autowidth:true, css: "webix_primary", 
            click: saveForm
        },
        { view: "button", value: "Delete", autowidth: true, css: "webix_danger",
            click: deleteEpisode
        },
        { view: "button", value: "Add Episode",      autowidth:true, click: newEpisode },
        { view: "button", value: "Back to Episodes", autowidth:true, click: backToEpisodes },
    ]
};

let loaded = false;

webix.ui({
    rows:[
        { borderless:true,
            cols: [
                { borderless:true },
                { borderless:true,
                    view: "form",
                    id: "episodeForm",
                    minWidth: 750,
                    maxWidth: 1250,
                    elementsConfig:{
                        labelPosition:"top",
                        on: {
                            onChange: function(){
                                if( loaded && !$$( "episodeForm" ).validate() ){
                                    webix.message({ text: "Make sure that all fields are valid", type: "error" })
                                }
                            }
                        }
                    },
                    elements: [
                        actionsRow,
                        { id:"ID",          name: "ID",          view: "text",   value: "", hidden: true, },
                        { id:"seriesId",    name: "seriesId",    view: "combo",  value: "", label: "Series",
                            options: "/series"
                        },
                        { id:"season",      name: "season",      view: "counter", label: "Season Number", min: 1,
                            step: 1,
                        },
                        { id:"title",       name: "title",       view: "text", value: "", label: "Episode Title" },
                        { id:"imgLink",     name: "imgLink",     view: "text", value: "", label: "Image URL" },
                        { id:"airDate",     name: "airDate",     view: "text", value: "", label: "Air Date" },
                        { id:"path",        name: "path",        view: "text", value: "", label: "Location On Disk" },
                        { id:"number",      name: "number",      view: "counter", value: 0, label: "Season Episode Number",
                            min: 0, step: 1
                        },
                        { id:"rating",      name: "rating",      view: "counter", value: 0, label: "Rating",
                            min: 0, max: 10, step: 0.1
                        },
                        { id:"raters",      name: "raters",      view: "counter", value: 0, label: "Number of Ratings",
                            min: 0, step: 1
                        },
                        { id:"description", name: "description", view: "textarea", value: "", label: "Description",
                            maxHeight: 300
                        },
                        { id:"nextEpisode", name: "nextEpisode", view: "text", value: "", label: "Location of Next Episode" },
                        webix.copy( actionsRow ),
                    ],
                    rules:{
                        title: webix.rules.isNotEmpty,
                        path: webix.rules.isNotEmpty,
                    },
                    on:{
                        onAfterLoad: function(){ loaded = true; }
                    },
                    url:{
                        $proxy:true,
                        load: function( view, params ){
                            let qs = new URLSearchParams( window.location.search );
                            let series = qs.get( "ser" );
                            let episode = qs.get( "id" );

                            return webix.ajax( `/episode-data?id=${episode}` );
                        }
                    }
                },
                { borderless:true },
            ]
        }
    ]
});

function newEpisode(){
    let qs = new URLSearchParams( window.location.search );
    let series = qs.get( "ser" );
    window.location = `/edit-episode`;
}

function backToEpisodes(){
    let qs = new URLSearchParams( window.location.search );
    let series = qs.get( "ser" ) || $$( "seriesId" ).getValue();

    if( !series ){
        webix.ui({
            id: "getSeriesToGoTo",
            view:"popup",
            position:"center",
            modal: true,
            width: 400, height:300,
            body: {
                rows:[
                    { id:"showSeries",    name: "seriesId",    view: "combo",  value: "", label: "Series",
                        options: "/series",
                        on:{ onChange: function(){ $$( "goToSeries" ).enable(); } }
                    },
                    {
                        cols:[
                            {},
                            { id: "goToSeries", view: "button", value: "Go To Series", autowidth:true, disabled: true,
                                click: function(){
                                    window.location = "/series_episodes?ser=" + $$( "showSeries" ).getValue();
                                }
                            },
                            { width: 15 },
                            { view: "button", value: "Cancel",       autowidth:true,
                                click: function(){
                                    $$( "getSeriesToGoTo" ).hide();
                                }
                            },
                            {}
                        ]
                    }
                ]
            }
        }).show();
    } else {
        window.location = "/series_episodes?ser=" + series;
    }
}

function saveForm(){
    let form = $$( "episodeForm" );
    if( form.validate() ) {
        let data = form.getValues();
        let combo = $$( "seriesId" );
        data.series = combo.getList().getItem( combo.getValue() ).value;
        console.log( data );
        let qs = new URLSearchParams(window.location.search);
        let episode = qs.get("id");

        webix.ajax().post(`/save-episode?&id=${episode}`, data)
            .then((data) => {
                let res = data.json();
                let type = "success";

                if (res.err)
                    type = "error"

                webix.message({text: res.msg, type});
            })
            .catch(() => {
                webix.message({text: "something went wrong...", type: "error"});
            });
    } else {
        webix.message({ text: "Please ensure all values are valid before saving the data.", type: "error" })
    }
}

function deleteEpisode(){
    let qs = new URLSearchParams(window.location.search);
    let episode = qs.get("id");

    webix.ajax().post(`/delete-episode?&id=${episode}`)
        .then((data) => {
            let res = data.json();
            let type = "success";

            if (res.err)
                type = "error"

            webix.message({text: res.msg, type});
        })
        .catch(() => {
            webix.message({text: "something went wrong...", type: "error"});
        });
}