const path = require("path");

const root = "./Media"
const seriesData = "_allMediaPlayerSeriesData.json"

module.exports = {
    mediaRoot: path.join( root ),
    seriesDataFileName: seriesData,
    seriesDataRoot: path.join( root, seriesData ),
    episodeFileName: "_mediaPlayerData.json",
    indexNames: { idToLoc: "idToDataLoc", mediaToId: "mediaLocToId", },
    currentDrive: path.parse(__dirname).root,
};