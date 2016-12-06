#!/usr/bin/env bash

npm install
bower install
webpack site/app/*.js site/app/bundle.js
npm start
