const restify = require(`restify`)
const builder = require(`botbuilder`)
const fs = require(`fs`)
const schedule = require(`node-schedule`)

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
var saveAddress
var job

const bot = new builder.UniversalBot(connector, (session) => {
    // 1. アドレスを取得してユーザ情報に保存
    const addr = session.message.address
    saveAddress = addr
    session.send(`（${addr.user.name}さんの情報手に入れちゃった。。）`)

    // 2. スケジュールの登録(HH:mm:10)になると発火する
    job = schedule.scheduleJob('10 * * * * *', function () {
        sendProactiveMessage(saveAddress)
    });
}).set(`strage`, inMemoryStorage)

function sendProactiveMessage(address) {
    const msg = new builder.Message().address(address)
    msg.text(`元気。。？君のこといつもみてるよ。。？`)
    bot.send(msg)
}
