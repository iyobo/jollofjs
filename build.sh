#!/usr/bin/env bash

#Build admin
cd packages/jollof
pwd
npm run build

#Commit Any changes
git add -A
git commit -a -m "Build"
git push
