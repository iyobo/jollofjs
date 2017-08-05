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

#Commit Any changes
git add -A
git commit -a -m "Build"
git push
