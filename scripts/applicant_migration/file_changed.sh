#!/usr/bin/env sh

before="${BEFORE_SHA}"
all_changed_files=$(git diff --name-only "$before" HEAD)

for changed_file in $all_changed_files; do
    if [ "$changed_file" = "scripts/applicant_migration/src/migration_script.py" ]; then
        echo true
        exit 0
    fi
done
echo false
