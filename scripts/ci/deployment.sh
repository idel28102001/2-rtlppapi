#!/bin/bash
set -eo pipefail
echo "Deploy script"

cd /home/projects/bitradar/backend

git pull

npm install
npm run build
pm2 start ecosystem.config.js