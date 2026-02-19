#!/usr/bin/env sh

all_changed_files=$(git diff --name-only HEAD^)

for changed_file in $all_changed_files;
do
    if [ "$changed_file" = "scripts/applicant_migration/src/migration_script.py" ]; then
        echo true
        exit 0
    fi
done
