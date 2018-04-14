#!/usr/bin/env bash

#Commit Any changes
git add -A
git commit -a -m "Build"
git push

lerna publish