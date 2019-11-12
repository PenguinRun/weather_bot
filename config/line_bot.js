const line = require('@line/bot-sdk')

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET_KEY
}

const client = new line.Client(config)

const lineMiddle = line.middleware(config)

module.exports = { client, lineMiddle }
