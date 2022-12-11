# Changelog

All notable changes to `gajosu/whatsapp-web-rest-api` will be documented in this file.

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
