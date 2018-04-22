const restify = require('restify')
const builder = require('botbuilder')

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
    session.beginDialog(`testA`)
})

bot.dialog(`testA`, [
    (session) => {
        session.send(`テストA開始`)
        session.beginDialog(`testB`)
    },
    (session, results) => {
        session.endDialog(`テストA終了です`)
    }
]
)

bot.dialog(`testB`, [
    (session) => {
        session.send(`テストB開始`)
        session.beginDialog(`testC`)
    },
    (session, results) => {
        session.endDialog(`テストB終了です`)
    }
]
)

bot.dialog(`testC`, [
    (session) => {
        session.send(`テストC開始`)
        builder.Prompts.text(session, `テストC：何か入力してください`)
    },
    (session, results) => {
        session.endDialog(`「${results.response}」と入力されました。テストC終了です`)
    }
]
)
