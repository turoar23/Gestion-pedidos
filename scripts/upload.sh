#!/bin/sh

echo "Start uploading to azape"

echo "Step 1 - Compress"
zip -r upload.zip . -x node_modules/**\* -x client/node_modules/**\*

echo "Step 2 - Send zip"
scp upload.zip server@azape.es:~

echo "Step 3 - clean directoy"
rm upload.zip

echo "Upload completed"