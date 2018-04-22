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
    session.beginDialog(`magicalBanana`)
}).set(`strage`, inMemoryStorage)

bot.dialog(`magicalBanana`, [
    (session, args) => {
        if (args && args.text) {
            session.conversationData.count += 1
            builder.Prompts.text(session, `${args.text}と言ったら？♪`)

        } else {
            session.conversationData.count = 1
            session.send(`マージーカールーバーナーナっ！`)
            builder.Prompts.text(session, `バナナと言ったら？♪`)
        }
    },
    (session, result) => {
        const count = session.conversationData.count
        if (count < 5) {
            session.conversationData.text = result.response
            session.replaceDialog(`magicalBanana`, { text: result.response })
        } else {
            session.endConversation(`よく頑張りました！また遊ぼうね！`)
        }
    }
]).endConversationAction(`endhogehoge`, `ぐすん。。また遊ぼうね！`, {
    matches: /^おしまい！$/i,
    confirmPrompt: `もう終わっちゃうの。。？`
})