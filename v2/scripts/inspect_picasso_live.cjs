const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const targetUrl = 'https://picasso-ecommerce-template.modulify.website/';
const artifactDir = '/Users/huynhtronghieu/.gemini/antigravity/brain/8927af5d-e2eb-4919-a203-0cb59d0cc10c';

async function main() {
  console.log('Starting headless Chrome...');
  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=/tmp/chrome_picasso_session'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listResp = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent(targetUrl), { method: 'PUT' });
    const tab = await listResp.json();
    console.log('Opened tab:', tab.id, tab.webSocketDebuggerUrl);

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method) {
        handleEvent(msg.method, msg.params);
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

    const networkUrls = new Set();
    function handleEvent(method, params) {
      if (method === 'Network.requestWillBeSent') {
        networkUrls.add(params.request.url);
      } else if (method === 'Runtime.consoleAPICalled') {
        console.log('[Browser Console]', params.type, ...params.args.map(a => a.value || a.description || ''));
      }
    }

    await send('Network.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Waiting 5s for page to fully load and hydrate...');
    await new Promise(r => setTimeout(r, 5000));

    // Lấy thông tin DOM
    const evalRes = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        scrollHeight: document.documentElement.scrollHeight,
        windowHeight: window.innerHeight,
        sectionsCount: document.querySelectorAll('section').length,
        imgs: Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight })),
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim()).filter(Boolean),
        buttons: Array.from(document.querySelectorAll('button, a[role=\"button\"], .btn')).map(b => b.innerText.trim()).filter(Boolean).slice(0, 20),
        canvases: document.querySelectorAll('canvas').length
      })`,
      returnByValue: true
    });
    console.log('Page DOM Stats:', JSON.stringify(evalRes.result.value, null, 2));

    // Chụp screenshot top
    const shotTop = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_top.jpg'), Buffer.from(shotTop.data, 'base64'));
    console.log('Saved picasso_live_top.jpg');

    // Cuộn xuống 600px
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 600, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shot600 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_scroll600.jpg'), Buffer.from(shot600.data, 'base64'));
    console.log('Saved picasso_live_scroll600.jpg');

    // Cuộn xuống 1500px
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 1500, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shot1500 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_scroll1500.jpg'), Buffer.from(shot1500.data, 'base64'));
    console.log('Saved picasso_live_scroll1500.jpg');

    // Cuộn xuống 3000px
    await send('Runtime.evaluate', { expression: `window.scrollTo({top: 3000, behavior: 'instant'});` });
    await new Promise(r => setTimeout(r, 1000));
    const shot3000 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_scroll3000.jpg'), Buffer.from(shot3000.data, 'base64'));
    console.log('Saved picasso_live_scroll3000.jpg');

    // Lấy toàn bộ outerHTML rendered
    const htmlRes = await send('Runtime.evaluate', {
      expression: 'document.documentElement.outerHTML',
      returnByValue: true
    });
    const renderedHtml = htmlRes.result.value;
    fs.writeFileSync(path.join(artifactDir, 'picasso_live_rendered.html'), renderedHtml, 'utf8');
    console.log('Saved picasso_live_rendered.html, length:', renderedHtml.length);

    // Lưu danh sách network requests
    fs.writeFileSync(path.join(artifactDir, 'picasso_network_urls.json'), JSON.stringify(Array.from(networkUrls), null, 2), 'utf8');
    console.log('Saved picasso_network_urls.json, count:', networkUrls.size);

    ws.close();
  } finally {
    proc.kill();
    console.log('Chrome closed.');
  }
}

main().catch(console.error);
