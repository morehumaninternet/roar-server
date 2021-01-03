#! /usr/bin/env bash
set -euo pipefail

if [ -z "$GITHUB_REF" ]; then
  echo "Only github actions should run this script"
  exit 1
fi

cat << EOF > .env.test
DB_HOST=postgres
DB_PASS=password
DB_USER=roar
DB_NAME=roar_test

TWITTER_API_KEY=aaaaaaaaaaaaaaaaaaaaaaaaa
TWITTER_KEY_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
TWITTER_ACCESS_TOKEN=aaaaaaaaaaaaaaaaaaa-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
TWITTER_TOKEN_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
EOF

NODE_ENV=test npm run knex migrate:latest
