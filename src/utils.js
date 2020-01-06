import { omitBy, startsWith } from 'lodash';
import { processors } from 'xml2js';

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
export const DEFAULT_REQUEST_HEADERS = {
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
export const XML_PARSE_OPTIONS = {
  trim: true,
  explicitArray: false,
  explicitRoot: false,
  tagNameProcessors: [processors.stripPrefix],
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
export const normalize = (obj = {}) => {
  const normalized = omitBy(obj, (value, key) => {
    return (
      startsWith(key, 'rss') ||
      startsWith(key, 'atom') ||
      startsWith(key, '#') ||
      startsWith(key, '@') ||
      startsWith(key, '$')
    );
  });
  return normalized;
};
