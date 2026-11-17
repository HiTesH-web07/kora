/**
 * Starting admin password for /admin. Change it from the admin page; the new one is
 * stored (hashed) under DATA_DIR and takes precedence over this value.
 * This is a scrypt hash, not the password itself.
 */
export const DEFAULT_ADMIN = { passwordHash: "scrypt:8e187688cc05b9919be97b522a2b5922:12d6735abfde0aa4924c74d2a9e193f94dae13c7f58a804a508deba0aafecfc4" };
