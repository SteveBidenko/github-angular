#!/usr/bin/env bash

if [ -d .idea ]; then
    export PRODUCTION=true
fi

npm install
bower install
webpack
npm start
