import fs from 'fs'
import UglifyJS from 'uglify-js'
import { chatBoxClientUrl } from '../config/env'

const script = fs.readFileSync('src/resources/chatBoxInit.js').toString()
const minified = UglifyJS.minify(script).code

const getChatBoxScript = (chatId) => {
    return minified.replace('IFRAME_SRC', chatBoxClientUrl + chatId)
}

export default getChatBoxScript
