#!/usr/bin/env bash
mkdir ../jollofjs/jollof-app
mkdir ../jollofjs/jollof-app/config
cp -r ./app ../jollofjs/jollof-app/
cp -r ./commands ../jollofjs/jollof-app/
cp -r ./static ../jollofjs/jollof-app/

cp  ./config/base.js ../jollofjs/jollof-app/config/base.js
cp  ./config/production.js ../jollofjs/jollof-app/config/production.js
cp  ./config/development.tpl.js ../jollofjs/jollof-app/config/development.js
cp  ./config/test.js ../jollofjs/jollof-app/config/test.js

cp  .gitignore ../jollofjs/jollof-app/.gitignore
cp  ./index.js ../jollofjs/jollof-app/index.js
cp  ./package.json ../jollofjs/jollof-app/package.json


