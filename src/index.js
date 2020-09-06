import { map } from 'lodash';
import { compact, mergeObjects } from '@lykmapipo/common';
import { parseStringPromise as parseXml } from 'xml2js';
import { all, get } from '@lykmapipo/http-client';
import { normalizeAlert } from '@lykmapipo/cap-common';
import FeedParser from 'feedparser';

import { DEFAULT_REQUEST_HEADERS, XML_PARSE_OPTIONS, normalize } from './utils';

/**
 * @function parseAlert
 * @name parseAlert
 * @description Parse given alert from xml to json
 * @param {string} alertXml valid alert xml.
 * @returns {Promise} promise resolve with alert on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * parseAlert(alertXml)
 *   .then(alert => { ... }) // => { identifier: ..., info: { ... } }
 *   .catch(error => { ... });
 */
export const parseAlert = (alertXml) => {
  // parse alert xml
  return parseXml(alertXml, XML_PARSE_OPTIONS).then((alertJson) => {
    // normalize & preserve required attributes
    const alert = normalizeAlert(normalize(alertJson));

    // return normalized alerts
    return alert;
  });
};

/**
 * @function parseFeed
 * @name parseFeed
 * @description Parse given alert feed from xml to json
 * @param {object} source valid alert feed readable stream.
 * @returns {Promise} promise resolve with alert feed on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * parseFeed(readableStream)
 *   .then(feed => { ... }) // => { channel: ..., items: { ... } }
 *   .catch(error => { ... });
 */
export const parseFeed = (source) =>
  new Promise((resolve, reject) => {
    // initialize feedparser
    const feedParser = new FeedParser({ addmeta: false });

    // initialize feed
    const feed = { channel: {}, items: [] };

    // handle stream error
    source.on('error', (error) => reject(error));

    // handle feed parsing errors
    feedParser.on('error', (error) => reject(error));

    // handle feed parsing end
    feedParser.on('end', () => resolve(feed));

    // handle feed meta parsing
    feedParser.on('meta', (meta) => {
      feed.channel = normalize(meta);
    });

    // process readable feed
    feedParser.on('readable', function onReadable() {
      const stream = this;
      let item;

      /*eslint-disable */
      // read items from the stream
      while ((item = stream.read()) !== null) {
        const copyOfItem = normalize(item);
        feed.items = compact([...feed.items, copyOfItem]);
      }
      /* eslint-enable */
    });

    // pipe reponse data to feedParser
    source.pipe(feedParser);
  });

/**
 * @function fetchAlert
 * @name fetchAlert
 * @description Issue http get request to fetch specific alert.
 * @param {object} optns valid fetch options.
 * @param {string} optns.url valid alert full url.
 * @returns {Promise} promise resolve with alert in CAP format on success
 * or error on failure.
 * @see {@link http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const optns = { url: ... };
 * fetchAlert(optns)
 *   .then(alert => { ... })
 *   .catch(error => { ... });
 */
export const fetchAlert = (optns) => {
  // normalize options
  const { url, ...options } = mergeObjects(optns, {
    responseType: 'text',
    headers: DEFAULT_REQUEST_HEADERS,
  });

  // fetch alert
  return get(url, options).then((alertXml) => {
    return parseAlert(alertXml);
  });
};

/**
 * @function fetchFeed
 * @name fetchFeed
 * @description Issue http get request to fetch alerts feed.
 * @param {object} optns valid fetch options.
 * @param {string} optns.url valid alert feed full url.
 * @returns {Promise} promise resolve with alerts in feed format on success
 * or error on failure.
 * @see {@link https://cyber.harvard.edu/rss/rss.html}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const optns = { url: ... };
 * fetchFeed(optns)
 *   .then(alert => { ... })
 *   .catch(error => { ... });
 */
export const fetchFeed = (optns) => {
  // normalize options
  const { url, ...options } = mergeObjects(optns, {
    responseType: 'stream',
    headers: DEFAULT_REQUEST_HEADERS,
  });

  // fetch feed
  return get(url, options).then((response) => {
    return parseFeed(response);
  });
};

/**
 * @function fetchAlerts
 * @name fetchAlerts
 * @description Issue http get request to fetch alerts from feed.
 * @param {object} optns valid fetch options.
 * @param {string} optns.url valid alert feed full url.
 * @returns {Promise} promise resolve with alerts in CAP format on success
 * or error on failure.
 * @see {@link http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const optns = { url: ... };
 * fetchAlerts(optns)
 *   .then(alert => { ... })
 *   .catch(error => { ... });
 */
export const fetchAlerts = (optns) => {
  // fetch feed
  return fetchFeed(optns).then(({ channel = {}, items = [] }) => {
    // collect feed item links
    const urls = compact(map([...items], (item) => item.link));
    // prepare alert fetch promises
    const tasks = map(urls, (url) => fetchAlert(mergeObjects(optns, { url })));
    // fetch alerts in parallel
    return all(...tasks).then((alerts) => {
      // return alerts in CAP format
      return { channel, items: alerts };
    });
  });
};
