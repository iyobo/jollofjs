#!/usr/bin/env bash

#Build admin
cd packages/jollof
pwd
npm run build

#Update CLI scaffold
cd ../jollof-app
pwd
npm run copy

#Return to root
cd ../..
pwd


