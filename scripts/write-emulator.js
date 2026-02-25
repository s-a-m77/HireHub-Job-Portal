// Simple script to write a test field to the Firestore emulator document app/state
(async function(){
  const url = 'http://localhost:8085/v1/projects/intern-7403e/databases/(default)/documents/app/state';
  const body = { fields: { test: { stringValue: 'hello-from-agent' } } };
  try {
    const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const text = await res.text();
    console.log('status', res.status);
    console.log(text);
  } catch (e) {
    console.error('fetch error', e);
  }
})();
