#!/usr/bin/env node

/**
 * Antigravity Arabic CLI
 * Command line tool for managing the Arabic RTL & BiDi fix in Antigravity.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { inject, getDevToolsPort, getTargets } = require('../lib/injector');
const daemon = require('../lib/daemon');

const GEMINI_CONFIG_DIR = path.join(os.homedir(), '.gemini', 'config');
const PLUGINS_DIR = path.join(GEMINI_CONFIG_DIR, 'plugins');
const TARGET_PLUGIN_DIR = path.join(PLUGINS_DIR, 'antigravity-arabic');

function printBanner() {
  console.log(`
==================================================
   🚀 Antigravity Arabic Enhancer (أنتيجرافيتي بالعربي)
   RTL, BiDi Isolation & Arabic Typography Fix
==================================================
`);
}

async function handleInject() {
  console.log('🔍 Detecting active Antigravity instances...');
  try {
    const res = await inject();
    console.log(`✅ Successfully connected via DevTools port ${res.port}`);
    res.targets.forEach(t => {
      if (t.success) {
        console.log(`   ✨ Injected into: "${t.title}"`);
      } else {
        console.log(`   ⚠️ Failed for "${t.title}": ${t.error}`);
      }
    });
    console.log('\n🎉 Arabic RTL & BiDi fix is now active in Antigravity!');
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

async function handleInstall() {
  console.log('📦 Installing Antigravity Arabic Native Plugin & Rules...');

  try {
    // 1. Ensure target plugin directories
    const rulesDir = path.join(TARGET_PLUGIN_DIR, 'rules');
    const scriptsDir = path.join(TARGET_PLUGIN_DIR, 'scripts');
    fs.mkdirSync(rulesDir, { recursive: true });
    fs.mkdirSync(scriptsDir, { recursive: true });

    // 2. Copy plugin manifest and rules
    const sourcePluginDir = path.join(__dirname, '..', 'plugin');
    fs.copyFileSync(
      path.join(sourcePluginDir, 'plugin.json'),
      path.join(TARGET_PLUGIN_DIR, 'plugin.json')
    );
    fs.copyFileSync(
      path.join(sourcePluginDir, 'hooks.json'),
      path.join(TARGET_PLUGIN_DIR, 'hooks.json')
    );
    fs.copyFileSync(
      path.join(sourcePluginDir, 'rules', 'AGENTS.md'),
      path.join(rulesDir, 'AGENTS.md')
    );

    // 3. Copy runtime scripts into plugin
    const sourceLibDir = path.join(__dirname, '..', 'lib');
    fs.copyFileSync(
      path.join(sourceLibDir, 'arabic-observer.js'),
      path.join(scriptsDir, 'arabic-observer.js')
    );
    fs.copyFileSync(
      path.join(sourceLibDir, 'injector.js'),
      path.join(scriptsDir, 'injector.js')
    );

    // Create runner script for hook
    const hookRunnerScript = `const { inject } = require('./injector');
inject().catch(() => {});
`;
    fs.writeFileSync(path.join(scriptsDir, 'run-inject.js'), hookRunnerScript, 'utf8');

    console.log(`✅ Plugin installed to: ${TARGET_PLUGIN_DIR}`);
    console.log('✅ Arabic Agent Rules installed.');
    console.log('✅ Automatic SessionStart lifecycle hook registered.');

    // Inject immediately into current session if running
    try {
      console.log('\n🔍 Injecting fix into currently running Antigravity window...');
      await inject();
      console.log('✨ Live window patched successfully!');
    } catch (e) {
      console.log('ℹ️ Antigravity is not currently open. The fix will activate automatically when you launch it.');
    }

    console.log('\n🎉 Installation complete! Everything is ready.');
  } catch (err) {
    console.error(`❌ Installation failed: ${err.message}`);
    process.exit(1);
  }
}

async function handleStatus() {
  const port = getDevToolsPort();
  console.log('📊 Antigravity Status:');
  if (port) {
    console.log(`   🟢 Antigravity is RUNNING (DevTools Port: ${port})`);
    const targets = await getTargets(port);
    console.log(`   📄 Active Windows: ${targets.length}`);
    targets.forEach(t => console.log(`      - ${t.title}`));
  } else {
    console.log('   ⚪ Antigravity is NOT currently running (or DevTools port not detected).');
  }

  const isPluginInstalled = fs.existsSync(path.join(TARGET_PLUGIN_DIR, 'plugin.json'));
  console.log(`   🔌 Native Plugin: ${isPluginInstalled ? '✅ Installed' : '❌ Not installed'}`);
}

function handleUninstall() {
  console.log('🗑️ Removing Antigravity Arabic plugin...');
  if (fs.existsSync(TARGET_PLUGIN_DIR)) {
    fs.rmSync(TARGET_PLUGIN_DIR, { recursive: true, force: true });
    console.log('✅ Plugin successfully removed.');
  } else {
    console.log('ℹ️ Plugin was not installed.');
  }
}

async function main() {
  const command = process.argv[2] || 'inject';

  printBanner();

  switch (command) {
    case 'inject':
      await handleInject();
      break;
    case 'install':
      await handleInstall();
      break;
    case 'status':
      await handleStatus();
      break;
    case 'daemon':
      console.log('🔄 Running in background daemon mode...');
      daemon.start(3000);
      break;
    case 'uninstall':
      handleUninstall();
      break;
    default:
      console.log(`
Usage:
  npx antigravity-arabic [command]

Commands:
  inject       Inject RTL & BiDi fix into running Antigravity windows (Default)
  install      Permanently install the native plugin, rules, and lifecycle hook
  status       Check if Antigravity is running and if the fix is installed
  daemon       Run continuous auto-injector daemon in background
  uninstall    Remove the native plugin and hooks
      `);
      break;
  }
}

main().catch(console.error);
