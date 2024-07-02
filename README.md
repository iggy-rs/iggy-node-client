# iggy-bin

iggy-bin is an unofficial node.js client for [iggy-rs](https://iggy.rs/)'s binary protocol, written with typescript. it currently only support tcp & tls transports.

diclaimer: although all iggy commands & basic client/stream are implemented this is still a WIP provided as is and has still a long way to go to be considered "battle tested".

## install

```
$ npm i iggy-bin
```

## basic usage

```ts
import { Client } from 'iggy-bin';

const credentials = { username: 'iggy', password: 'iggy' };

const c = new Client({
  transport: 'TCP',
  options: { port: 8090, host: '127.0.0.1' },
  credentials
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
