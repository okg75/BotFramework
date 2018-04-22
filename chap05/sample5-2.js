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

server.get(`/api/callBot`, (req, res, next) => {
    // 2. APIの実行によりbotを実行する
    sendProactiveMessage(saveAddress)
    res.send(`triggered`)
    next()
})

var inMemoryStorage = new builder.MemoryBotStorage();
const bot = new builder.UniversalBot(connector, (session) => {
    saveAddress = session.message.address
    session.send(`君の情報はもらったー！`)
}).set(`strage`, inMemoryStorage)

var saveAddress

// 3. 自発的にメッセージを送信する
function sendProactiveMessage(address) {
    const msg = new builder.Message().address(address)
    msg.text(`${address.user.name}さーん！おーい！`)
    bot.send(msg)
}
