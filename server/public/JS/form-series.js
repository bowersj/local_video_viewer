let actionsRow = {
    cols:[
        {},
        { view: "button", value: "Save", autowidth:true, css: "webix_primary",
            click: saveForm
        },
        { view: "button", value: "Add Series", autowidth:true,
            click: newSeries
        },
        { view: "button", value: "Cancel", autowidth:true, css: "webix_danger",
            click: backToSeries
        },
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
                    id: "seriesForm",
                    minWidth: 750,
                    maxWidth: 1250,
                    elementsConfig:{
                        labelPosition:"top",
                        on: {
                            onChange: function(){
                                if( loaded && !$$( "seriesForm" ).validate() ){
                                    webix.message({ text: "Make sure that all fields are valid", type: "error" })
                                }
                            }
                        }
                    },
                    elements: [
                        actionsRow,
                        { id:"seriesId",    name: "seriesId",    view: "text",     value: "", hidden: true, },
                        { id:"series",      name: "series",      view: "text",     value: "", label: "Series Name" },
                        { id:"imgSrc",      name: "imgSrc",      view: "text",     value: "", label: "Image URL" },
                        { id:"path",        name: "path",        view: "text",     value: "", label: "Location On Disk" },
                        { id:"description", name: "description", view: "textarea", value: "", label: "Description",
                            maxHeight: 300
                        },
                        webix.copy( actionsRow ),
                    ],
                    rules:{
                        series: webix.rules.isNotEmpty,
                        path:   webix.rules.isNotEmpty,
                    },
                    on:{
                        onAfterLoad: function(){ loaded = true; }
                    },
                    url:{
                        $proxy:true,
                        load: function( view, params ){
                            let qs = new URLSearchParams( window.location.search );
                            let series = qs.get( "ser" );

                            return webix.ajax( `/series-data?ser=${series}` );
                        }
                    }
                },
                { borderless:true },
            ]
        }
    ]
});

function newSeries(){
    window.location = `/edit-series`;
}

function backToSeries(){ window.location = "/"; }

function saveForm(){
    let form = $$( "seriesForm" );
    if( form.validate() ) {
        let data = form.getValues();

        webix.ajax().post(`/save-series`, data )
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