const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const targetUrl = 'http://localhost:4328/picasso';
const artifactDir = '/Users/huynhtronghieu/.gemini/antigravity/brain/8927af5d-e2eb-4919-a203-0cb59d0cc10c';

async function main() {
  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=/tmp/chrome_picasso_local_test'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listResp = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(targetUrl), { method: 'PUT' });
    const tab = await listResp.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();
    const consoleLogs = [];
    const failedRequests = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push({ type: msg.params.type, text: msg.params.args.map(a => a.value || a.description || '').join(' ') });
      } else if (msg.method === 'Network.loadingFailed') {
        failedRequests.push(msg.params);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Network.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Waiting 3s for local page to render...');
    await new Promise(r => setTimeout(r, 3000));

    // Capture screenshot top
    const shotTop = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'proof_picasso_local_top.jpg'), Buffer.from(shotTop.data, 'base64'));
    console.log('Saved proof_picasso_local_top.jpg');

    // Scroll to 600px
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 600, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shot600 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'proof_picasso_local_scroll600.jpg'), Buffer.from(shot600.data, 'base64'));

    // Scroll to 1500px
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 1500, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shot1500 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'proof_picasso_local_scroll1500.jpg'), Buffer.from(shot1500.data, 'base64'));

    // Scroll to 3000px
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 3000, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shot3000 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'proof_picasso_local_scroll3000.jpg'), Buffer.from(shot3000.data, 'base64'));

    // Test click Open Cart
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[aria-label*=\"cart\" i], button:has(svg), header button');
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const shotCart = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'proof_picasso_local_cart.jpg'), Buffer.from(shotCart.data, 'base64'));

    console.log('Failed requests count:', failedRequests.length);
    if (failedRequests.length > 0) {
      console.log('Failed:', failedRequests.slice(0, 5));
    }
    console.log('Console logs count:', consoleLogs.length);
    const errors = consoleLogs.filter(l => l.type === 'error');
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

main().catch(console.error);

