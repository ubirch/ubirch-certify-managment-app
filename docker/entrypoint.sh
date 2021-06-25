#!/bin/bash

/replace-markers.sh

/opt/bitnami/scripts/nginx/entrypoint.sh "$@"

echo ""
exec "$@"
