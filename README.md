# iggy node.js client

iggy node.js client for [iggy-rs](https://iggy.rs/)'s binary protocol, written in typescript. it currently only support tcp & tls transports.

diclaimer: although all iggy commands & basic client/stream are implemented this is still a WIP, provided as is, and has still a long way to go to be considered "battle tested".

note: previous works on node.js http client has been moved to [iggy-node-http-client](<https://github.com/iggy-rs/iggy-node-http-client) (moved on 04 July 2024)

## install

```
$ npm i iggy-bin
```

## basic usage

```ts
import { Client } from "iggy-bin";

const credentials = { username: "iggy", password: "iggy" };

const c = new Client({
  transport: "TCP",
  options: { port: 8090, host: "127.0.0.1" },
  credentials,
});

const stats = await c.system.getStats();
```

## use sources

### Install

```
$ npm ci
```

### build

```
$ npm run build
```

### test

```
$ npm run test
```
