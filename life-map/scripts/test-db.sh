#!/usr/bin/env bash
# Applies the Supabase shim + all migrations to a throwaway PostgreSQL database,
# then runs the RLS test suite. Requires a local PostgreSQL (psql + createdb).
#
#   npm run test:db                       # uses the current user / PG* env vars
#   PGUSER=postgres npm run test:db
set -euo pipefail
cd "$(dirname "$0")/.."

DB="${LIFEMAP_TEST_DB:-lifemap_test}"
dropdb --if-exists "$DB" >/dev/null
createdb "$DB"
trap 'dropdb --if-exists "$DB" >/dev/null 2>&1 || true' EXIT

psql -X -q -v ON_ERROR_STOP=1 -d "$DB" -f supabase/tests/supabase_shim.sql >/dev/null
for f in supabase/migrations/*.sql; do
  psql -X -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f" >/dev/null
done
psql -X -v ON_ERROR_STOP=1 -d "$DB" -f supabase/tests/rls.test.sql
echo "✓ RLS tests passed"
