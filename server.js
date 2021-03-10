const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const got = require('got');
const app = express()

// get env variables
require('dotenv').config()

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route is to serve project on different page routes except root `/`
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const getVideos = async (url_search) => {
	const response_search = await got(url_search);
  const search = JSON.parse(response_search.body);
  const ids = await search.items.filter(item => item.id.videoId).map(item => item.id.videoId);
  let url_details = 'https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&key=' + process.env.YOUTUBE_API_KEY + '&id=' + ids.join('&id=');
	const response_details = await got(url_details);
  const details = JSON.parse(response_details.body);
  const merged = await search.items.filter(search_item => search_item.id.videoId).map(search_item => {
    const detail_index = details.items.findIndex(detail_item => {
      return detail_item.id == search_item.id.videoId
    });
    if(detail_index !== -1){
      search_item.contentDetails = details.items[detail_index].contentDetails;
      search_item.statistics = details.items[detail_index].statistics;
    }
    return search_item;
  });
  return merged;
}

app.get('/related/:related_to/:limit', async function (req, res) {
  try {
    const url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' + process.env.YOUTUBE_API_KEY + '&maxResults=' + req.params['limit'] + '&relatedToVideoId=' + req.params['related_to'];
    res.send( await getVideos(url) )
  } catch (e) {
    res.send(e)
  }
});

app.get('/search/:q/:limit', async function (req, res) {
  try {
    const url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' + process.env.YOUTUBE_API_KEY + '&maxResults=' + req.params['limit'] + '&q=' + req.params['q'];
    res.send( await getVideos(url) )
  } catch (e) {
    res.send(e)
  }
})


const port = process.env.PORT || 8080
app.listen(port)
console.log(`app is listening on port: ${port}`)
