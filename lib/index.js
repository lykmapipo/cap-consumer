'use strict';

const lodash = require('lodash');
const common = require('@lykmapipo/common');
const xml2js = require('xml2js');
const httpClient = require('@lykmapipo/http-client');
const capCommon = require('@lykmapipo/cap-common');
const FeedParser = require('feedparser');

/**
 * @constant DEFAULT_REQUEST_HEADERS
 * @name DEFAULT_REQUEST_HEADERS
 * @description Default http request headers
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @private
 * @ignore
 */
const DEFAULT_REQUEST_HEADERS = {
  accept: 'application/xhtml+xml',
  'content-type': 'application/xhtml+xml',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
};

/**
 * @constant XML_PARSE_OPTIONS
 * @name XML_PARSE_OPTIONS
 * @description Default xml parse options
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @private
 * @ignore
 */
const XML_PARSE_OPTIONS = {
  trim: true,
  explicitArray: false,
  explicitRoot: false,
  tagNameProcessors: [xml2js.processors.stripPrefix],
};

/**
 * @function normalize
 * @name normalize
 * @description Normalize object to remove unused properties
 * @param {object} obj valid object to normalize.
 * @returns {object} normalize object
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * normalize(obj);
 * // => { ... }
 */
const normalize = (obj = {}) => {
  // remove unused properties
  const normalized = lodash.omitBy(obj, (value, key) => {
    return (
      lodash.startsWith(key, 'rss') ||
      lodash.startsWith(key, 'atom') ||
      lodash.startsWith(key, '#') ||
      lodash.startsWith(key, '@') ||
      lodash.startsWith(key, '$') ||
      lodash.startsWith(key, 'Signature')
    );
  });
  // return
  return common.mergeObjects(normalized);
};

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
const parseAlert = (alertXml) => {
  // parse alert xml
  return xml2js.parseStringPromise(alertXml, XML_PARSE_OPTIONS).then((alertJson) => {
    // normalize & preserve required attributes
    const alert = capCommon.normalizeAlert(normalize(alertJson));

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
const parseFeed = (source) =>
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
        feed.items = common.compact([...feed.items, copyOfItem]);
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
const fetchAlert = (optns) => {
  // normalize options
  const { url, ...options } = common.mergeObjects(optns, {
    responseType: 'text',
    headers: DEFAULT_REQUEST_HEADERS,
  });

  // fetch alert
  return httpClient.get(url, options).then((alertXml) => {
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
const fetchFeed = (optns) => {
  // normalize options
  const { url, ...options } = common.mergeObjects(optns, {
    responseType: 'stream',
    headers: DEFAULT_REQUEST_HEADERS,
  });

  // fetch feed
  return httpClient.get(url, options).then((response) => {
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
const fetchAlerts = (optns) => {
  // fetch feed
  return fetchFeed(optns).then(({ channel = {}, items = [] }) => {
    // collect feed item links
    const urls = common.compact(lodash.map([...items], (item) => item.link));
    // prepare alert fetch promises
    const tasks = lodash.map(urls, (url) => fetchAlert(common.mergeObjects(optns, { url })));
    // fetch alerts in parallel
    return httpClient.all(...tasks).then((alerts) => {
      // return alerts in CAP format
      return { channel, items: alerts };
    });
  });
};

exports.fetchAlert = fetchAlert;
exports.fetchAlerts = fetchAlerts;
exports.fetchFeed = fetchFeed;
exports.parseAlert = parseAlert;
exports.parseFeed = parseFeed;
