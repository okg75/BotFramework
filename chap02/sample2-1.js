// 1. モジュールの読み込み
const restify = require('restify')
const builder = require('botbuilder')

// 2. サーバの生成
const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`ヾ(⌒(ﾉ'ω')ﾉ＜起動しました`)
})

// 3. コネクタの作成
const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
})
server.post(`/api/messages`, connector.listen())

// 4. botのインスタンスを作成
const bot = new builder.UniversalBot(connector, (session) => {
    const name = session.message.user.name
    const text = session.message.text
    session.send(`${name}さんが「${text}」と言いました`);
})