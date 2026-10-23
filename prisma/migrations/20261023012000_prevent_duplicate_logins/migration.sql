-- Roll back all indexes if existing duplicates prevent any one of them.
BEGIN;

CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

COMMIT;
