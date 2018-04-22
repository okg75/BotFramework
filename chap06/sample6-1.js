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
    session.send(`こんにちは`)
})

bot.dialog(`/greeting/morning`, (session) => {
    const name = session.message.user.name
    session.send(`${name}さんおはようございます。今日も一日頑張りましょうね！`);
}).triggerAction({
    matches: /^おはよう$/i
});

bot.dialog(`/greeting/night`, (session) => {
    const name = session.message.user.name
    session.send(`${name}さんおやすみなさい。良い夢をみてくださいねｚｚＺ`);
}).triggerAction({
    matches: /^おやすみ$/i
});