#!/bin/bash

if [ -e .env ]; then
  set -a
  source .env
  set +a
fi

cat > wrangler.toml <<EOL
name = "calljourney-server"
compatibility_date = "2024-07-25"

workers_dev = true

[vars]
WEB_URL = "http://localhost:5173"
SERVER_URL = "http://localhost:8787"
TWILIO_API_URL = "${TWILIO_API_URL}"
TWILIO_ACCOUNT_SID = "${TWILIO_ACCOUNT_SID}"
TWILIO_AUTH_TOKEN = "${TWILIO_AUTH_TOKEN}"
TWILIO_PHONE_NUMBER = "${TWILIO_PHONE_NUMBER}"
MAILER_SEND_API_TOKEN = "${MAILER_SEND_API_TOKEN}"
SENDER_MAIL_ADDRESS = "${SENDER_MAIL_ADDRESS}" 

[env.production]
name = "calljourney-server"
[env.production.vars]
WEB_URL = "https://calljourney.pages.dev"
SERVER_URL = "https://calljourney-server.nanikasi1024.workers.dev"

[[d1_databases]]
binding = "DB"
database_name = "calljourney-dev"
database_id = "${DATABASE_ID}"
migrations_dir = "./src/infra/repository/d1/migrations"
EOL
echo "generated wrangler toml"