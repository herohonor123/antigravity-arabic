/**
 * Antigravity Arabic Injector
 * Finds the Antigravity instance via DevToolsActivePort and injects the Arabic enhancer.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function getDevToolsPort() {
  const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const portFile = path.join(appData, 'Antigravity', 'DevToolsActivePort');

  if (fs.existsSync(portFile)) {
    try {
      const content = fs.readFileSync(portFile, 'utf8');
      const lines = content.trim().split(/\r?\n/);
      const port = parseInt(lines[0], 10);
      if (!isNaN(port) && port > 0) {
        return port;
      }
    } catch (e) {
      // Ignore read errors
    }
  }
  return null;
}

async function getTargets(port) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    if (!res.ok) return [];
    const list = await res.json();
    return list.filter(t => t.type === 'page');
  } catch (err) {
    return [];
  }
}

function evaluateInTarget(wsUrl, script) {
  return new Promise((resolve, reject) => {
    let ws;
    const timeout = setTimeout(() => {
      if (ws) ws.close();
      reject(new Error('WebSocket timeout connecting to Antigravity target.'));
    }, 4000);

    try {
      ws = new WebSocket(wsUrl);
    } catch (err) {
      clearTimeout(timeout);
      return reject(err);
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 100,
        method: 'Runtime.evaluate',
        params: {
          expression: script,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      clearTimeout(timeout);
      try {
        const data = JSON.parse(event.data);
        ws.close();
        resolve(data.result);
      } catch (e) {
        ws.close();
        resolve(null);
      }
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      reject(err);
    };
  });
}

async function inject(options = {}) {
  const port = options.port || getDevToolsPort();
  if (!port) {
    throw new Error('Antigravity is not currently running or DevTools port is unavailable.');
  }

  const targets = await getTargets(port);
  if (targets.length === 0) {
    throw new Error(`Antigravity DevTools found on port ${port}, but no active page windows found.`);
  }

  const observerScript = fs.readFileSync(path.join(__dirname, 'arabic-observer.js'), 'utf8');

  const results = [];
  for (const target of targets) {
    try {
      await evaluateInTarget(target.webSocketDebuggerUrl, observerScript);
      results.push({ id: target.id, title: target.title, success: true });
    } catch (err) {
      results.push({ id: target.id, title: target.title, success: false, error: err.message });
    }
  }

  return { port, targets: results };
}

module.exports = {
  getDevToolsPort,
  getTargets,
  inject
};
