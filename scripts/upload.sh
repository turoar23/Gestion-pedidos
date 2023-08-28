#!/bin/sh

echo "Start uploading to azape"

echo "step 1 - build"
yarn run build

echo "Step 2 - Compress"
zip -r upload.zip . -x node_modules/**\* -x client/node_modules/**\*

echo "Step 3 - Send zip"
scp upload.zip server@azape.es:~

echo "Step 4 - clean directoy"
rm upload.zip

echo "Upload completed"