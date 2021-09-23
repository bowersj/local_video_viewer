webix.ui({
    cols: [
        {},
        {
            view: "form",
            id: "episodeForm",
            minWidth: 750,
            maxWidth: 1250,
            elementsConfig:{
                labelPosition:"top"
            },
            elements: [
                { id:"ID",          name: "ID",          view: "text",   value: "", hidden: true, },
                { id:"seriesId",    name: "seriesId",    view: "combo", value: "", label: "Series",
                    options: "/series"
                },
                { id:"season",      name: "season",      view: "counter", label: "Season Number", min: 1,
                    step: 1, width: 400,
                },
                { id:"title",       name: "title",       view: "text", value: "", label: "Episode Title" },
                { id:"imgLink",     name: "imgLink",     view: "text", value: "", label: "Image Link" },
                { id:"airDate",     name: "airDate",     view: "text", value: "", label: "Air Date" },
                { id:"path",        name: "path",        view: "text", value: "", label: "Location On Disk" },
                { id:"number",      name: "number",      view: "counter", value: 0, label: "Season Episode Number", min: 0 },
                { id:"rating",      name: "rating",      view: "counter", value: 0, label: "Rating", min: 0, max: 10 },
                { id:"raters",      name: "raters",      view: "counter", value: 0, label: "Number of Ratings", min: 0 },
                { id:"description", name: "description", view: "text", value: "", label: "Description" },
                { id:"nextEpisode", name: "nextEpisode", view: "text", value: "", label: "Location of Next Episode" },
            ]
        },
        {},
    ]
});