#!/bin/bash

set -e

rm -rf dist/*
[ -e gato.tar.gz ] && rm gato.tar.gz

npm run build:prod

tar czf gato.tar.gz --transform 's,^dist,gato,' dist
