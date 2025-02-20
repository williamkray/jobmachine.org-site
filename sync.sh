#!/usr/bin/env bash

rsync -aP . mssj.me:/home/wreck/jobmachine/site/site --exclude=".git" --exclude="sync.sh"
