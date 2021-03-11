export const getVideos = async (options) => {
  return new Promise( async (resolve, reject) => {
    try {
      let url;
      if(options.use_local_data && options.related_to) {
        url = 'details.json'
      } else if(options.use_local_data && options.q) {
        url = 'search.json'
      } else if(options.related_to) {
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
