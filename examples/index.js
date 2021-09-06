import { fetchFeed } from '../src';

const fromUrl = '';

fetchFeed(fromUrl)
  .then((feed) => {
    console.log(feed);
  })
  .catch((error) => {
    console.log(error);
  });
