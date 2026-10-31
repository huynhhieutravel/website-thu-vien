const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const targetUrl = 'https://picasso-ecommerce-template.modulify.website/';
const artifactDir = '/Users/huynhtronghieu/.gemini/antigravity/brain/8927af5d-e2eb-4919-a203-0cb59d0cc10c';

async function main() {
  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=/tmp/chrome_picasso_session_2'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listResp = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(targetUrl), { method: 'PUT' });
    const tab = await listResp.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();
    const newNetworkUrls = new Set();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method === 'Network.requestWillBeSent') {
        newNetworkUrls.add(msg.params.request.url);
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

    await new Promise(r => setTimeout(r, 4000));

    // Scroll to 4200
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 4200, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shot4200 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_scroll4200.jpg'), Buffer.from(shot4200.data, 'base64'));

    // Scroll to 5108 (Bottom)
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 5200, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shotBottom = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_scroll_bottom.jpg'), Buffer.from(shotBottom.data, 'base64'));

    // Tìm và click nút giỏ hàng (top-right button)
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[aria-label*=\"cart\" i], button:has(svg), header button, div.fixed button');
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const shotCart = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_cart_open.jpg'), Buffer.from(shotCart.data, 'base64'));

    console.log('Done capturing bottom & cart.');
    console.log('Total new network URLs:', newNetworkUrls.size);
    ws.close();
  } finally {
    proc.kill();
  }
}

main().catch(console.error);

