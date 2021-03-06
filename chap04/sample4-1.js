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
    const customMessage = new builder.Message(session)
        .text(`**おはようございます！** 朝です！`)
        .textFormat(`markdown`)
        .textLocale(`en-us`)
    session.send(customMessage)
})
