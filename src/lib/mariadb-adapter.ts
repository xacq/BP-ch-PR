import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Builds the Prisma MariaDB/MySQL driver adapter from DATABASE_URL.
 *
 * `allowPublicKeyRetrieval` is required for MySQL 8's default
 * `caching_sha2_password` auth over a non-TLS connection (trusted local /
 * docker network). Switch to TLS if the DB is ever exposed beyond that.
 */
export function makeMariaDbAdapter(): PrismaMariaDb {
  const url = new URL(process.env.DATABASE_URL!);
  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    charset: "utf8mb4",
    allowPublicKeyRetrieval: true,
    connectionLimit: 10,
  });
}
