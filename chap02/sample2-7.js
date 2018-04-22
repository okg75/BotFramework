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

var inMemoryStorage = new builder.MemoryBotStorage();

const bot = new builder.UniversalBot(connector, (session) => {
    session.beginDialog(`testA`)
}).set(`strage`, inMemoryStorage)

bot.dialog(`testA`, [
    (session, result) => {
        session.send(`testAが開始しました`)
        session.beginDialog(`testB`)
    },
    (session, result) => {
        session.send(`testAが終了しました`)
    }
])

bot.dialog(`testB`, [
    (session) => {
        session.send(`testB開始`)
        builder.Prompts.choice(session,
            `cancelTestB：選択してください`,
            `OK|キャンセル`,
            { listStyle: builder.ListStyle.list })
    },
    (session, result, next) => {
        if (result.response.entity == `キャンセル`) {
            session.cancelDialog()
        } else {
            session.beginDialog(`testC`)
        }
    },
    (session, result) => {
        session.endDialog(`testB終了します`)
    }
])

bot.dialog(`testC`, (session) => {
    session.endDialog(`testC！！`)
})