#!/usr/bin/env bash
# Aplica migrações + seed num Postgres local descartável e roda os testes de RLS.
# Uso: PGHOST=/caminho/socket PGPORT=5432 PGUSER=postgres supabase/tests/run.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
P="psql -v ON_ERROR_STOP=1 -q"
$P -d postgres -c "drop database if exists vu_test" -c "create database vu_test"
for f in supabase/tests/auth_stub.sql supabase/migrations/*.sql supabase/seed.sql; do $P -d vu_test -f "$f" > /dev/null; done
$P -d vu_test -f supabase/tests/rls_test.sql | grep -E "PASSARAM|mastery_ok| t$"
