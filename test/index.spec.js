import { createReadStream, readFileSync } from 'fs';
import { expect, nock } from '@lykmapipo/test-helpers';

import {
  parseAlert,
  parseFeed,
  fetchAlert,
  fetchFeed,
  fetchAlerts,
} from '../src';

const BASE_URL = 'https://cap-sources.s3.amazonaws.com/tz-tma-en';

describe('consumer', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should parse alert xml to json', done => {
    const xml = readFileSync(`${__dirname}/fixtures/alert.xml`, 'utf-8');
    parseAlert(xml)
      .then(alert => {
        expect(alert).to.exist;
        expect(alert.identifier).to.exist;
        expect(alert.sender).to.exist;
        expect(alert.sent).to.exist;
        expect(alert.status).to.exist;
        expect(alert.msgType).to.exist;
        expect(alert.scope).to.exist;
        expect(alert.references).to.exist;
        expect(alert.info).to.exist;
        expect(alert.info.language).to.exist;
        expect(alert.info.category).to.exist;
        expect(alert.info.event).to.exist;
        expect(alert.info.responseType).to.exist;
        expect(alert.info.urgency).to.exist;
        expect(alert.info.severity).to.exist;
        expect(alert.info.certainty).to.exist;
        expect(alert.info.onset).to.exist;
        expect(alert.info.expires).to.exist;
        expect(alert.info.senderName).to.exist;
        expect(alert.info.headline).to.exist;
        expect(alert.info.description).to.exist;
        expect(alert.info.instruction).to.exist;
        expect(alert.info.web).to.exist;
        expect(alert.info.contact).to.exist;
        expect(alert.info.area).to.exist;
        expect(alert.info.area.areaDesc).to.exist;
        expect(alert.info.area.geometry).to.exist;
        expect(alert.info.area.centroid).to.exist;
        expect(alert.hash).to.exist;
        done(null, alert);
      })
      .catch(error => {
        expect(error).to.not.exist;
        done(error);
      });
  });

  it('should parse alerts feed', done => {
    const source = createReadStream(`${__dirname}/fixtures/feed.xml`);
    parseFeed(source)
      .then(feed => {
        expect(feed).to.exist.and.be.an('object');
        expect(feed.channel).to.exist.and.be.an('object');
        expect(feed.items).to.exist.and.be.an('array');
        done(null, feed);
      })
      .catch(error => {
        expect(error).to.not.exist;
        done(error);
      });
  });

  it('should fetch alert', done => {
    nock(BASE_URL)
      .get('/alert.xml')
      .query(true)
      .reply(200, function onReply() {
        expect(this.req.headers).to.exist;
        return createReadStream(`${__dirname}/fixtures/alert.xml`);
      });

    fetchAlert({ url: `${BASE_URL}/alert.xml` })
      .then(alert => {
        expect(alert).to.exist;
        expect(alert.identifier).to.exist;
        expect(alert.sender).to.exist;
        expect(alert.sent).to.exist;
        expect(alert.status).to.exist;
        expect(alert.msgType).to.exist;
        expect(alert.scope).to.exist;
        expect(alert.references).to.exist;
        expect(alert.info).to.exist;
        expect(alert.info.language).to.exist;
        expect(alert.info.category).to.exist;
        expect(alert.info.event).to.exist;
        expect(alert.info.responseType).to.exist;
        expect(alert.info.urgency).to.exist;
        expect(alert.info.severity).to.exist;
        expect(alert.info.certainty).to.exist;
        expect(alert.info.onset).to.exist;
        expect(alert.info.expires).to.exist;
        expect(alert.info.senderName).to.exist;
        expect(alert.info.headline).to.exist;
        expect(alert.info.description).to.exist;
        expect(alert.info.instruction).to.exist;
        expect(alert.info.web).to.exist;
        expect(alert.info.contact).to.exist;
        expect(alert.info.area).to.exist;
        expect(alert.info.area.areaDesc).to.exist;
        expect(alert.info.area.geometry).to.exist;
        expect(alert.info.area.centroid).to.exist;
        expect(alert.hash).to.exist;
        done(null, alert);
      })
      .catch(error => {
        expect(error).to.not.exist;
        done(error);
      });
  });

  it('should fetch alerts feed', done => {
    nock(BASE_URL)
      .get('/feed.xml')
      .query(true)
      .reply(200, function onReply() {
        expect(this.req.headers).to.exist;
        return createReadStream(`${__dirname}/fixtures/feed.xml`);
      });

    fetchFeed({ url: `${BASE_URL}/feed.xml` })
      .then(feed => {
        expect(feed).to.exist.and.be.an('object');
        expect(feed.channel).to.exist.and.be.an('object');
        expect(feed.items).to.exist.and.be.an('array');
        done(null, feed);
      })
      .catch(error => {
        expect(error).to.not.exist;
        done(error);
      });
  });

  it('should fetch alerts', done => {
    nock(BASE_URL)
      .get('/feed.xml')
      .query(true)
      .reply(200, function onReply() {
        expect(this.req.headers).to.exist;
        return createReadStream(`${__dirname}/fixtures/feed.xml`);
      });

    nock(BASE_URL)
      .get(/-([0-9])+(.xml)(?:[?#]|$)/i) // match alerts url
      .query(true)
      .reply(200, function onReply() {
        expect(this.req.headers).to.exist;
        return createReadStream(`${__dirname}/fixtures/alert.xml`);
      });

    fetchAlerts({ url: `${BASE_URL}/feed.xml` })
      .then(alerts => {
        expect(alerts).to.exist.and.be.an('object');
        expect(alerts.channel).to.exist.and.be.an('object');
        expect(alerts.items).to.exist.and.be.an('array');

        const alert = alerts.items[0];
        expect(alert).to.exist;
        expect(alert.identifier).to.exist;
        expect(alert.sender).to.exist;
        expect(alert.sent).to.exist;
        expect(alert.status).to.exist;
        expect(alert.msgType).to.exist;
        expect(alert.scope).to.exist;
        expect(alert.references).to.exist;
        expect(alert.info).to.exist;
        expect(alert.info.language).to.exist;
        expect(alert.info.category).to.exist;
        expect(alert.info.event).to.exist;
        expect(alert.info.responseType).to.exist;
        expect(alert.info.urgency).to.exist;
        expect(alert.info.severity).to.exist;
        expect(alert.info.certainty).to.exist;
        expect(alert.info.onset).to.exist;
        expect(alert.info.expires).to.exist;
        expect(alert.info.senderName).to.exist;
        expect(alert.info.headline).to.exist;
        expect(alert.info.description).to.exist;
        expect(alert.info.instruction).to.exist;
        expect(alert.info.web).to.exist;
        expect(alert.info.contact).to.exist;
        expect(alert.info.area).to.exist;
        expect(alert.info.area.areaDesc).to.exist;
        expect(alert.info.area.geometry).to.exist;
        expect(alert.info.area.centroid).to.exist;
        expect(alert.hash).to.exist;

        done(null, alerts);
      })
      .catch(error => {
        expect(error).to.not.exist;
        done(error);
      });
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
