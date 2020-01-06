import { expect, faker } from '@lykmapipo/test-helpers';
import { processors } from 'xml2js';

import {
  DEFAULT_REQUEST_HEADERS,
  XML_PARSE_OPTIONS,
  normalize,
} from '../src/utils';

describe('utils', () => {
  it('should provide default request headers', () => {
    expect(DEFAULT_REQUEST_HEADERS).to.be.eql({
      accept: 'application/xhtml+xml',
      'content-type': 'application/xhtml+xml',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    });
  });

  it('should provide xml parse options', () => {
    expect(XML_PARSE_OPTIONS).to.be.eql({
      trim: true,
      explicitArray: false,
      explicitRoot: false,
      tagNameProcessors: [processors.stripPrefix],
    });
  });

  it('should normalize object value', () => {
    const obj = {
      uid: faker.random.uuid(),
      rss: faker.random.uuid(),
      atom: faker.random.uuid(),
      '#': faker.random.uuid(),
      '@': faker.random.uuid(),
      $: faker.random.uuid(),
    };
    const normalized = normalize(obj);
    expect(normalized).to.be.eql({ uid: obj.uid });
    expect(normalized).to.not.have.a.property('rss');
    expect(normalized).to.not.have.a.property('atom');
    expect(normalized).to.not.have.a.property('#');
    expect(normalized).to.not.have.a.property('@');
    expect(normalized).to.not.have.a.property('$');

    expect(normalize()).to.be.eql({});
  });
});
