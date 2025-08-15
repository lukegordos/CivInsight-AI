#!/bin/bash
cd "$(dirname "$0")"
export NODE_OPTIONS="--max-old-space-size=4096"
npx --yes next@14.2.31 dev
