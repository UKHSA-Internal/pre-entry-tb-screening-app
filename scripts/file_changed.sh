#!/usr/bin/env sh

if [ $# -eq 0 ]; then
    echo "The file path has to be provided!"
    exit 1
fi

echo "File to check: $1"

before="${BEFORE_SHA}"
all_changed_files=$(git diff --name-only "$before" HEAD)

for changed_file in $all_changed_files; do
    if [ "$changed_file" = "$1" ]; then
        echo true
        exit 0
    fi
done
echo false
