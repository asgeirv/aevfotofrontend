# AEV Photo App Frontend

Build dev: `docker build -t aevfoto_frontend_dev --target dev .`

Build prod: `docker build -t aevfoto_frontend --target prod .`

## Docker Compose

### Config
**DB password:** Should be placed in a file named `pw.txt` in the app root folder.

**Docker Compose variables:** These are defined in the `.env` file which should be put in the app root folder.
* DB_PATH: where to persist the database on host
*  INIT_PATH: something
*  PHOTOS_PATH: root folder for photos on host

### Run


(PROD) Run: `docker compose -f compose.yml -f compose.prod.yml up -d`

(DEV) Run: `docker compose -f compose.yml -f compose.dev.yml watch`