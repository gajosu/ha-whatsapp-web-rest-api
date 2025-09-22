# Changelog

All notable changes to `gajosu/whatsapp-web-rest-api` will be documented in this file.

## v2.4.3 - 2025-09-22

- Update Dockerfile to use Node.js 20.15.0, upgrade whatsapp-web.js to v1.34.1, and configure Puppeteer to use a specified browser path (2c68bb7)

## v2.4.2 - 2025-08-10

Commits on Aug 10, 2025

- feat: Upgrade whatsapp-web.js to v1.32.0 and fix build issues (#188) by @MLAN1O

## v2.4.1 - 2024-12-02

- Adds a NumberValidator (#184) by @Tsjippy.
- Fix puppeteer config (dcca48a9ea72f2924f46b68f86c6a4580754305f) by @gajosu.

## v2.4.0 - 2024-09-30

- bump whatsapp-web.js (570e5fc47e212a61435b6c3a55daef4ad23a46be) by @gajosu

## v2.3.9 - 2024-04-16

- fix whatsapp-web.js client instance 62deab46a1228b79292981f9e3fe39979e5d262e by @gajosu

## v2.3.8 - 2024-01-24

- fix ts syntax 703e0d2218297a7f2a811cdd91c1074fb3a49e5c
- Bump whatsapp-web.js to 1.23.0 c96eba94b2b963c0227b250e0f0ee123ebc670a2

## v2.3.7 - 2023-09-18

- fix Client.js in order to detect login in new WhatsAppWeb

## V2.3.7 - 2023-09-18

- fix Client.js in order to detect login in new WhatsAppWeb

## v2.3.6 - 2023-08-28

- Bump whatsapp-web.js to v1.22.2-alpha.0 (#164) by @Jebsta

## v2.3.5 - 2023-08-12

- bump whatsapp-web.js to v1.22.1 by @gajosu  (4b5189a19dca5606a0b9dc6e666ce43315427925)

## v2.3.4 - 2023-05-27

- Add message reaction event (#149) by @gajosu
- Add new endpoint to get a message by ID (#150)  by @gajosu
- Fix docs (49c7d6837d4c4d2080a9bfec5a08228a7925ed3b) by @gajosu

## v2.3.3 - 2023-05-20

- Fix docs for Send Message endpoint (6a2e212b751d17420a0a117893aa153d195ea100) by @gajosu
- Add message limit to MessageGetter service (#148) by @gajosu

## v2.3.2 - 2023-05-20

- Revert "Bump whatsapp-web.js from 1.19.5 to 1.20.0-alpha.0 (#147) by @gajosu
- Bump whatsapp-web.js (fab1e5da47fcffb1be3a88248818b06e5c1fcbcd) by @gajosu

## v2.3.1 - 2023-05-20

Bump whatsapp-web.js from 1.19.5 to 1.20.0-alpha.0 (#146) by @gajosu

## V2.3.0 - 2023-05-19

### Breaking Changes

- The deprecated POST endpoint `/api/messages` has been removed. Please use the updated endpoint `/api/chats/:id/messages` for sending messages to a specific chat.

#### Migration Steps

To migrate from the deprecated `/api/messages` endpoint to the new `/api/chats/:id/messages` endpoint, follow these steps:

1. Update any client applications or scripts that make requests to the deprecated endpoint `/api/messages` to use the new endpoint `/api/chats/:id/messages` instead.
2. Make sure to include the appropriate chat ID in the request URL for the new endpoint (`/api/chats/:id/messages`), replacing `:id` with the actual chat ID.
3. Update any documentation or references that mention the deprecated endpoint `/api/messages` to reflect the use of the new endpoint `/api/chats/:id/messages`.

Please note that using the deprecated `/api/messages` endpoint will result in a "404 Not Found" response.

If you have any questions or need assistance with the migration process, please don't hesitate to reach out.

### All Changes

- Bump socket.io from 4.6.0 to 4.6.1 (#134) by @dependabot
- Add media file download functionality for messages (#144) by @gajosu
- Remove deprecated POST endpoint `/api/messages (#145)

## v2.2.6 - 2023-02-11

- fix whatsapp web error (#84)

## v2.2.5 - 2023-01-18

- Bump eslint-plugin-import from 2.27.0 to 2.27.4 (#55) by @dependabot
- Bump eslint-config-standard-with-typescript from 26.0.0 to 27.0.1 (#56) by @dependabot
- Bump eslint from 8.31.0 to 8.32.0 (#57) by @dependabot
- Bump ts-jest from 29.0.4 to 29.0.5 (#58) by @dependabot
- Bump whatsapp-web.js from 1.18.4 to 1.19.2 (#59) by @dependabot
- Bump eslint-plugin-import from 2.27.4 to 2.27.5 (#60) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.48.1 to 5.48.2 (#61 ) by @dependabot

## v2.2.4 - 2023-01-12

- Bump @types/node from 18.11.12 to 18.11.13 (#36) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.46.0 to 5.46.1 (#37) by @dependabot
- Bump @types/node from 18.11.13 to 18.11.15 (#38) by @dependabot
- Bump @types/express from 4.17.14 to 4.17.15 (#39) by @dependabot
- Bump eslint-config-standard-with-typescript from 23.0.0 to 24.0.0 (#40) by @dependabot
- Bump eslint from 8.29.0 to 8.30.0 (#41) by @dependabot
- Bump @types/node from 18.11.15 to 18.11.17 (#42) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.46.1 to 5.47.0 (#43) by @dependabot
- Bump @types/node from 18.11.17 to 18.11.18 (#44) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.47.0 to 5.47.1 (#45) by @dependabot
- Bump @types/jest from 29.2.4 to 29.2.5 (#46) by @dependabot
- Bump eslint from 8.30.0 to 8.31.0 (#47) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.47.1 to 5.48.0 (#48) by @dependabot
- Bump eslint-config-standard-with-typescript from 24.0.0 to 26.0.0 (#49) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.48.0 to 5.48.1 (#50) by @dependabot
- Bump eslint-plugin-n from 15.6.0 to 15.6.1 (#51) by @dependabot
- Bump ts-jest from 29.0.3 to 29.0.4 (#52) by @dependabot
- Bump eslint-plugin-import from 2.26.0 to 2.27.0 (#53) by @dependabot
- Bump whatsapp-web.js from 1.18.3 to 1.18.4 (#54) by @gajosu

## v2.2.3 - 2022-12-11

- fix logger timestamp (#35)

## v2.2.2 - 2022-12-11

- Bump eslint from 8.28.0 to 8.29.0 (#23) by @dependabot
- Bump supertest from 6.3.1 to 6.3.2 (#24) by @dependabot
- Bump eslint-plugin-n from 15.5.1 to 15.6.0 (#25) by @dependabot
- Bump @types/jest from 29.2.3 to 29.2.4 (#26) by @dependabot
- Bump @types/node from 18.11.10 to 18.11.11 (#27) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.45.0 to 5.45.1 (#28) by @dependabot
- Bump supertest from 6.3.2 to 6.3.3 (#29) by @dependabot
- Bump typescript from 4.9.3 to 4.9.4 (#30) by @dependabot
- Bump @typescript-eslint/eslint-plugin from 5.45.1 to 5.46.0   (#31) by @dependabot
- Bump @types/node from 18.11.11 to 18.11.12 (#32) by @dependabot
- Add Log level (#33)

## v2.2.1 - 2022-12-02

- Update docs (#21)
- Add message sender options in chat message controller (#22)

## v2.2.0 - 2022-12-01

- Bump @typescript-eslint/eslint-plugin from 5.44.0 to 5.45.0 (#18) by @dependabot
- Bump @types/node from 14.18.33 to 18.11.10 (#19) by @dependabot
- New endponts (#20)
- Add new enpoints docs to README.md

## v2.1.1 - 2022-11-28

- Bump whatsapp-web.js from 1.18.3 to 1.18.4 by @dependabot

## v2.1.0 - 2022-11-23

- Add cache to build docker image workflow (#13)
- Add changelog file
- Add dependabot auto merge workflow
- Add contribution guides
- Add issue template
- Bump socket.io from 4.5.3 to 4.5.4 (#14)
- Add new Home Assistant events (#16)

## v2.0.1 - 2022-11-22

- Bump @typescript-eslint/eslint-plugin from 5.43.0 to 5.44.0 (#8)
- Bump @types/jest from 29.2.2 to 29.2.3 (#10)
- Bump eslint from 8.27.0 to 8.28.0 (#9)
- security fix upgrade jquery from 1.11.2 to 2.2.4 (#11)
- fix number validation (#12)

## v2.0.4 - 2022-11-21

- Add ha core api support (#7)
- Delete unused packages
- Add github action workflow for build docker image

## v2.0.3 - 2022-11-20

- Bump eslint from 8.27.0 to 8.28.0
- Bump @types/jest from 29.2.2 to 29.2.3
- Fix message creator controller, add @c.us suffix if is not send
- Fix return raw message events
- Fix message validator, now it validates the "to" parameter, it must be a number or a chat id

## v2.0.2 - 2022-11-19

- Fix supervisor token, now is get from env vars

## v2.0.1 - 2022-11-19

- Add supervisor token in logs when fails HA event publisher

## v2.0.0 - 2022-11-19

- Added tests with jest
- Added dependency injection with true-di
- Added Eslint
- Added Home asisstan integration
- Added github action: lint and tests

## v1.0.0 - 2022-11-08

- First version
