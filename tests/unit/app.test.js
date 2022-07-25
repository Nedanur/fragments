const request = require('supertest');

const app = require('../../src/app');

describe('GET requests for resources that can"t be found', () => {
    test('404 error if request route not found', () =>
    request(app).get('/no-such-route').expect(404));
  });