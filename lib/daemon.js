/**
 * Antigravity Arabic Daemon
 * Continuously ensures any open Antigravity window has the Arabic enhancer attached.
 */

const { inject, getDevToolsPort } = require('./injector');

let isRunning = false;
let checkInterval = null;

async function tick() {
  try {
    const port = getDevToolsPort();
    if (port) {
      await inject({ port });
    }
  } catch (err) {
    // Silent fail when window is closed or busy
  }
}

function start(intervalMs = 3000) {
  if (isRunning) return;
  isRunning = true;
  console.log('[Antigravity-Arabic] Background daemon started.');
  tick();
  checkInterval = setInterval(tick, intervalMs);
}

function stop() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  isRunning = false;
  console.log('[Antigravity-Arabic] Background daemon stopped.');
}

if (require.main === module) {
  start(4000);
}

module.exports = {
  start,
  stop,
  tick
};
