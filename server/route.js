let map = Object.create(null);


map.home = "/"
map.seriesEpisodes = "/series_episodes"
map.watch = "/watch"
map.stream = "/stream"
map.watchFromFile = "/watch_from_file"
map.streamFromFile = "/stream_from_file"

map.editEpisode = "/edit-episode"
map.series = "/series"
map.episodeData = "/episode-data"
map.saveEpisode = "/save-episode"
map.deleteEpisode = "/delete-episode"

map.editSeries = "/edit-series"
map.saveSeries = "/save-series"
map.deleteSeries = "/delete-series"
map.seriesData = "/series-data"

// file explorer endpoints
map.fileExplorerRoot = "/file_explorer"
map.filesAtLevel = "/items_at_level"
map.detailItems = "/detailed_items"
map.fileExplorer = "/"


module.exports = map;