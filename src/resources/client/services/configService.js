const getConfig = () => {
    try {
        return JSON.parse(window.instantchat_config)
    } catch (err) {
        return null
    }
}

const chatBoxConfig = getConfig()

export default chatBoxConfig
