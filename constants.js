const path = require("path");

const root = "D:\\media"
const seriesData = "_allMediaPlayerSeriesData.json"

module.exports = {
    mediaRoot: path.join( root ),
    seriesDataRoot: path.join( root, seriesData ),
    episodeFileName: "_mediaPlayerData.json"
};