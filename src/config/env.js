const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, PORT, CHAT_BOX_CLIENT_URL } = process.env
export const databaseConfig = {
    host: DB_HOST || 'localhost',
    port: DB_PORT || 3306,
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    database: DB_NAME || 'instantchat',
}

const { TOKEN_SECRET, REFRESH_TOKEN_SEVRET } = process.env
export const secrets = {
    tokenSecret: TOKEN_SECRET || 'x3e3e2rjfbnrhbhj4bjhb4ghje',
    refreshTokenSecret: REFRESH_TOKEN_SEVRET || 'dcjnh4j3bfjh34bjh',
}

export const port = PORT || 3434

export const chatBoxClientUrl = CHAT_BOX_CLIENT_URL || 'http://localhost:3000/panel/chatbox/?chatId='
