import { createReadStream, readFileSync } from 'fs';
import { expect, nock } from '@lykmapipo/test-helpers';

import { parseAlert, fetchAlert } from '../src';

const BASE_URL = 'https://cap-sources.s3.amazonaws.com/tz-tma-en';

describe('cap consumer', () => {
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

  afterEach(() => {
    nock.cleanAll();
  });
});
