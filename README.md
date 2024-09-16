# [CallJourney](https://calljourney.pages.dev/)
飲食店の電話予約代行サービス

## How to start
1. Clone this repository
2. Open in devcontainer
3. Make .env file under apps/server & fill blank
```env
DATABASE_ID=""
TWILIO_API_URL=""
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
MAILER_SEND_API_TOKEN=""
SENDER_MAIL_ADDRESS=""
```
4. Run below to migrate D1 database
```bash
pnpm run migrate:local:dev
```
5. Run ```pnpm run dev```

---

## [Backend Endpoint](https://calljourney-server.nanikasi1024.workers.dev/)
I recommend you to use swagger. See [here](https://calljourney-server.nanikasi1024.workers.dev/ui)
