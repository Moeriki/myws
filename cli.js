#!/usr/bin/env node

'use strict';

const yargs = require('yargs');

const { plex } = require('./index');

const noop = () => {};

yargs
  .command('plex', 'manage plex server', (args) => args
    .command('status', 'get plex server status', noop, () => {
      plex.status()
        .then(console.log)
        .catch(console.error)
      ;
    })
    .command('start', 'start plex server', noop, () => {
      plex.start()
        .then(console.log)
        .catch(console.error)
      ;
    })
    .command('stop', 'stop plex server', noop, () => {
      plex.stop()
        .then(console.log)
        .catch(console.error)
      ;
    })
  )
  .help()
  .argv
;
