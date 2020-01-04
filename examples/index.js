import { fetchFeed } from '@lykmapipo/cap-consumer';

const fromUrl = '';

fetchFeed(fromUrl)
  .then(feed => {
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  });
