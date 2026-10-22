const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = 'http://127.0.0.1:' + server.address().port;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('health endpoint returns a healthy response', async () => {
  const response = await fetch(baseUrl + '/healthz');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('admin route renders without exposing secrets', async () => {
  const response = await fetch(baseUrl + '/admin');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Photo library|Your work/);
  assert.match(html, /Sign in securely/);
  assert.doesNotMatch(html, /service_role/i);
});

test('admin configuration endpoint is non-cacheable and safely serialised', async () => {
  const response = await fetch(baseUrl + '/admin-config.js');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.match(await response.text(), /SHUTON_CONFIG/);
});

test('contact endpoint rejects incomplete messages', async () => {
  const response = await fetch(baseUrl + '/send-message', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name: 'Test' })
  });
  assert.equal(response.status, 400);
});
