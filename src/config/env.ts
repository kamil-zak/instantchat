const { TOKEN_SECRET, REFRESH_TOKEN_SEVRET, PORT, CHAT_BOX_CLIENT_URL } = process.env

export const secrets = {
    tokenSecret: TOKEN_SECRET || 'x3e3e2rjfbnrhbhj4bjhb4ghje',
    refreshTokenSecret: REFRESH_TOKEN_SEVRET || 'dcjnh4j3bfjh34bjh',
}

export const port = PORT || 3434

export const chatBoxClientUrl = CHAT_BOX_CLIENT_URL || 'http://localhost:3000/panel/chatbox/?chatId='
