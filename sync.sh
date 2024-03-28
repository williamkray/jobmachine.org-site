#!/usr/bin/env bash

rsync -aP . mssj.me:/home/wreck/docker-matrix/storage/jobmachine/nginx/site/ --exclude=".git" --exclude="sync.sh"
