import { isEmpty, omit } from 'lodash';
import { mergeObjects, hashOf } from '@lykmapipo/common';
import { parseStringPromise as parseXml, processors } from 'xml2js';
import { get } from '@lykmapipo/http-client';

// constants
const XML_PARSE_OPTIONS = {
  trim: true,
  explicitArray: false,
  explicitRoot: false,
  tagNameProcessors: [processors.stripPrefix],
};

/**
 * @function parseAlert
 * @name parseAlert
 * @description Parse given alert from xml to json
 * @param {string} xml valid alert xml.
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
 * parseAlert(xml)
 *   .then(alert => { ... }) // => { identifier: ..., info: { ... } }
 *   .catch(error => { ... });
 */
export const parseAlert = xml => {
  // parse alert xml
  return parseXml(xml, XML_PARSE_OPTIONS).then(json => {
    // preserve required attributes
    const alert = mergeObjects(omit(json, '$'), { info: { area: {} } });

    // normalize dates
    //
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

    // compute hash
    alert.hash = hashOf(alert);

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
  const { url, ...options } = mergeObjects(optns);

  // fetch alert
  return get(url, options);
};

export const fetchAlerts = () => {};
