#!/bin/bash

# Clean up
echo "Clean up"
rm ./cayley.tar.gz
rm -rf ./cayley

# Download
echo "Download"
wget --output-document=cayley.tar.gz https://github.com/cayleygraph/cayley/releases/download/v0.6.1/cayley_v0.6.1_linux_386.tar.gz

# Extract
echo "Extract"
mkdir -p ./cayley
tar -xf ./cayley.tar.gz -C ./cayley --strip-components=1 && rm ./cayley.tar.gz

# Setup
echo "Setup"
(cd ./cayley && ./cayley init --config=../cayley.json)
