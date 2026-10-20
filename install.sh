#!/usr/bin/env bash

# Antigravity Arabic - One-Click Unix Installer

echo "=================================================="
echo "   🚀 Antigravity Arabic Enhancer (أنتيجرافيتي بالعربي)"
echo "=================================================="

if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is required to install Antigravity Arabic."
    echo "Please install Node.js from https://nodejs.org and rerun this script."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/bin/cli.js" install
