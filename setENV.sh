#!/usr/bin/env bash

echo "Checking environment variables for the project"
echo "---------------------------------------------"
echo "Return Name: $RETURNNAME"
echo "Return Address: $RETURNADDRESS"
echo "Return City: $RETURNCITY"
echo "Return State: $RETURNSTATE"
echo "Return Zip: $RETURNZIP"

sed -i -r \
    -e "s/^(const returnName =).*/\1 '$RETURNNAME';/" \
    -e "s/^(const returnAddress =).*/\1 '$RETURNADDRESS';/" \
    -e "s/^(const returnCity =).*/\1 '$RETURNCITY';/" \
    -e "s/^(const returnState =).*/\1 '$RETURNSTATE';/" \
    -e "s/^(const returnZip =).*/\1 '$RETURNZIP';/" \
    /usr/share/nginx/html/index.js

echo "---------------------------------------------"
echo "Environment variables set for the project"
head -n 5 /usr/share/nginx/html/index.js
echo "---------------------------------------------"

echo "Starting nginx"
nginx -g 'daemon off;'