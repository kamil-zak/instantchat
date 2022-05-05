const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env
export const databaseConfig = {
    host: DB_HOST || 'localhost',
    port: DB_PORT || 3306,
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    database: DB_NAME || 'instantchat',
}

const { TOKEN_SECRET, REFRESH_TOKEN_SEVRET } = process.env
export const secrets = {
    tokenSecret: TOKEN_SECRET || '-',
    refreshTokenSecret: REFRESH_TOKEN_SEVRET || '-',
}
