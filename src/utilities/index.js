export const getVideos = async (options) => {
  return new Promise( async (resolve, reject) => {
    try {
      let url;
      if(options.related_to) {
        url = '/related/' + options.related_to + '/' + options.limit
      } else if(options.q) {
        url = '/search/' + options.q + '/' + options.limit
      }
      return resolve(await fetchUrl(url));
    } catch (e) {
      return reject(e);
    }
  })
}

export const getVideosOld = async (options) => {
  return new Promise( async (resolve, reject) => {
    try {
      let url_search = 'https://youtube.googleapis.com/youtube/v3/search?key=' + options.api_key + '&part=snippet&type=video&maxResults=' + options.limit;
      if(options.related_to) {
        url_search = url_search + '&relatedToVideoId=' + options.related_to
      }
      if(options.q) {
        url_search = url_search + '&q=' + options.q
      }
      //let url_search = 'sample.json';
      const search = await fetchUrl(url_search);
      const ids = await search.items.filter(item => item.id.videoId).map(item => item.id.videoId);
      let url_details = 'https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&key=' + options.api_key + '&id='+ids.join('&id=');
      //let url_details = 'sample2.json';

      const details = await fetchUrl(url_details);
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
      return resolve(merged);
    } catch (e) {
      return reject(e);
    }
  })
}

export const fetchUrl = (url) => {
  return new Promise( (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (event) => {
      if(event.currentTarget.status == 200) {
        return resolve(JSON.parse(event.currentTarget.responseText));
      } else {
        return reject(JSON.parse(event.currentTarget.responseText));
      }
    });
    xhr.addEventListener('error', () => {
      return reject('Error fetching URL');
    });
    xhr.open('GET', url);
    xhr.send();
  });
}
