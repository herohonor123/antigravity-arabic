/**
 * Antigravity Arabic Daemon
 * Continuously ensures any open Antigravity window has the Arabic enhancer attached.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { inject, getDevToolsPort, getTargets } = require('./injector');

const LOCK_FILE = path.join(os.tmpdir(), 'antigravity-arabic-daemon.lock');

function acquireLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const pid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8'), 10);
      if (!isNaN(pid)) {
        try {
          process.kill(pid, 0); // Check if process is still alive
          // If kill doesn't throw, another daemon is running
          return false;
        } catch (e) {
          // Process is dead, stale lock
        }
      }
    }
    fs.writeFileSync(LOCK_FILE, process.pid.toString(), 'utf8');
    return true;
  } catch (err) {
    return true;
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const pid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8'), 10);
      if (pid === process.pid) {
        fs.unlinkSync(LOCK_FILE);
      }
    }
  } catch (e) {}
}

process.on('exit', releaseLock);
process.on('SIGINT', () => { releaseLock(); process.exit(); });
process.on('SIGTERM', () => { releaseLock(); process.exit(); });

let isRunning = false;
let checkInterval = null;
let lastPort = null;
let injectedTargets = new Set();

async function tick() {
  try {
    const port = getDevToolsPort();
    if (!port) {
      lastPort = null;
      injectedTargets.clear();
      return;
    }

    if (port !== lastPort) {
      lastPort = port;
      injectedTargets.clear();
    }

    const targets = await getTargets(port);
    for (const target of targets) {
      // Re-inject if target is new or newly navigated
      if (!injectedTargets.has(target.id)) {
        try {
          await inject({ port });
          injectedTargets.add(target.id);
        } catch (e) {
          // Target might be closing
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
}

function start(intervalMs = 1500) {
  if (isRunning) return;
  if (!acquireLock()) {
    console.log('[Antigravity-Arabic] Another daemon instance is already active. Exiting.');
    process.exit(0);
  }
  isRunning = true;
  console.log('[Antigravity-Arabic] Background continuous daemon started (1500ms interval).');
  tick();
  checkInterval = setInterval(tick, intervalMs);
}

function stop() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  isRunning = false;
  releaseLock();
  console.log('[Antigravity-Arabic] Background daemon stopped.');
}

if (require.main === module) {
  start(1500);
}

module.exports = {
  start,
  stop,
  tick
};
