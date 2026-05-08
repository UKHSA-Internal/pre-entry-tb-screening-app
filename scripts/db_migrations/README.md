# Database migrations

This is a __AWS Glue Job__ Python script containing some functions to migrate data. The functions appropriately change records in Application table, Applicant table or both, depends on selected 'migration'.

List of current migrations (and their related function name):

- migrate_applicants (migrate_applicant),
- set_application_statusgroup (set_application_statusgroup),
- rewrite_db_items (rewrite_applicant_records, rewrite_application_root_records, rewrite_application_other_records),

The names: _migrate_applicants_, _set_application_statusgroup_ and _rewrite_db_items_ are the migration names used in the code and workflow scripts.

## migrate_applicants

This is the migration that changes '_pk_' attribute in applicant records, and sets up some new ones. It's also modifies application records (adding, for example, 'applicantId' attribute).

## set_application_statusgroup

The migration only purpose is to add _applicationStatusGroup_ attribute to each 'root' record (a record with '_sk_': '_APPLICATION#ROOT_') in application table. It ignores existing value for the attribute and calculates a new one (in case the value is incorrect, it will be fixed).

## rewrite_db_items

Running this migration all records in both applicant and application tables will be 're-written' (without changing any value). It is to trigger DBStreams and eventually send the records to EDAP service.

The name: _rewrite_db_items_ is used in a workflow script (it's easier to use just one short name), but in the code there will be 3 separate migrations ('submigrations') to achive the task (and to re-use existing script functionalities). Internally these 3 new 'migrations' will be added in place of '_rewrite_db_items_':

- rewrite_applicant_records,
- rewrite_application_root_records,
- rewrite_application_other_records.

_rewrite_applicant_records_ will rewrite/refresh applicant records.
Application records will be dealt with the other 2 functions. First all 'root' records will be rewritten, then all other records.
