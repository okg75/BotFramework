const restify = require(`restify`)
const builder = require(`botbuilder`)
const fs = require(`fs`)

const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`ヾ(⌒(ﾉ'ω')ﾉ＜起動しました`)
})

const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
})
server.post(`/api/messages`, connector.listen())

const bot = new builder.UniversalBot(connector, (session) => {
    const msg = session.message

    // 1. 添付の有無を確認
    if (msg.attachments && msg.attachments.length > 0) {
        const attachment = msg.attachments[0]

        // 2. コンテンツを送信する
        session.send({
            text: `あなたはこれを送りました！`,
            attachments: [
                {
                    contentType: attachment.contentType,
                    contentUrl: attachment.contentUrl,
                    name: attachment.name
                }
            ]
        })
    } else {
        session.send(`あなたは「${session.message.text}」と言いましたね！`)
    }
})
