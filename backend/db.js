const mysql = require("mysql2/promise");

const isLocalDatabase =
    !process.env.DB_HOST ||
    process.env.DB_HOST === "localhost" ||
    process.env.DB_HOST === "127.0.0.1";

const poolConfig = {
    host: process.env.DB_HOST || "localhost",

    port: Number(process.env.DB_PORT || 3306),

    user: process.env.DB_USER || "root",

    password: process.env.DB_PASSWORD || "",

    database: process.env.DB_NAME || "eventspark",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0
};

// Aiven MySQL requires SSL
if (!isLocalDatabase) {
    poolConfig.ssl = {
        rejectUnauthorized: false
    };
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;