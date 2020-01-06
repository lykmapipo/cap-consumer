import { isEmpty } from 'lodash';
import { mergeObjects, hashOf } from '@lykmapipo/common';
import { parseCoordinateString, centroidOf } from '@lykmapipo/geo-tools';
import { parseStringPromise as parseXml } from 'xml2js';
import { get } from '@lykmapipo/http-client';
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
export const parseAlert = alertXml => {
  // parse alert xml
  return parseXml(alertXml, XML_PARSE_OPTIONS).then(alertJson => {
    // preserve required attributes
    const alert = mergeObjects(normalize(alertJson), { info: { area: {} } });

    // compute hash
    alert.hash = hashOf(alert);

    // normalize sent date
    alert.sent = !isEmpty(alert.sent) ? new Date(alert.sent) : alert.sent;

    // normalize onset date
    alert.info.onset = !isEmpty(alert.info.onset)
      ? new Date(alert.info.onset)
      : alert.info.onset;

    // normalize expires date
    alert.info.expires = !isEmpty(alert.info.expires)
      ? new Date(alert.info.expires)
      : alert.info.expires;

    // parse circle and polygon to geojson geometry
    if (!isEmpty(alert.info.area.polygon) || !isEmpty(alert.info.area.circle)) {
      const coordinateString =
        alert.info.area.polygon || alert.info.area.circle;
      const geometry = parseCoordinateString(coordinateString);
      const centroid = centroidOf(geometry);
      alert.info.area.geometry = geometry;
      alert.info.area.centroid = centroid;
    }

    // return alerts
    return alert;
  });
};

/**
 * @function fetchAlert
 * @name fetchAlert
 * @description Issue http get request to fetch specific alert.
 * @param {object} optns valid fetch options.
 * @param {string} optns.url valid alert full url.
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
 * const optns = { url: ... };
 * fetchAlert(optns)
 *   .then(alert => { ... })
 *   .catch(error => { ... });
 */
export const fetchAlert = optns => {
  // normalize options
  const { url, ...options } = mergeObjects(optns, {
    headers: DEFAULT_REQUEST_HEADERS,
  });

  // fetch alert
  return get(url, options).then(alertXml => {
    return parseAlert(alertXml);
  });
};

// TODO: export, document, test
export const readFeed = source => {
  // readFeedStream | readFeedSource
  return new Promise((resolve, reject) => {
    // initialize feedparser
    const feedParser = new FeedParser({ addmeta: false });

    // initialize feed
    const feed = { channel: {}, items: [] };

    // handle stream error
    source.on('error', error => reject(error));

    // handle feed parsing errors
    feedParser.on('error', error => reject(error));

    // handle feed parsing end
    feedParser.on('end', () => resolve(feed));

    // handle feed meta parsing
    feedParser.on('meta', meta => {
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
        feed.items.push(copyOfItem);
      }
      /* eslint-enable */
    });

    // pipe reponse data to feedParser
    source.pipe(feedParser);
  });
};

// TODO: export, document, test
export const fetchFeed = optns => {
  // normalize options
  const { url, ...options } = mergeObjects(optns, {
    responseType: 'stream',
    headers: DEFAULT_REQUEST_HEADERS,
  });

  // fetch feed
  return get(url, options).then(response => {
    return readFeed(response);
  });
};

// TODO: export, document, test
export const fetchAlerts = () => {
  // fetch feed
  // fetch alerts
  // cleanup alerts(parseAlert)
  // merge feed + fetched
};
