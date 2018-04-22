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

// 1. 入力した内容などを保存しておくストレージを作成する
var inMemoryStorage = new builder.MemoryBotStorage();

const bot = new builder.UniversalBot(connector, [
    (session) => {
        // 1. 引数にユーザ情報を渡す
        session.beginDialog(`registProfile`, session.userData.profile)
    },
    (session, result) => {
        // 4. ウォーターフォールが終了した結果を受け取る
        session.userData.profile = result.response
        const name = session.userData.profile.name
        const age = session.userData.profile.age
        session.send(`あなたは${name}さん、${age}歳ですね！`)
    }
]).set(`strage`, inMemoryStorage)

bot.dialog(`registProfile`, [
    (session, args, next) => {
        session.dialogData.profile = args || {}
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, `あなたの名前はなんですか？`)
        } else {
            // 2. 名前がすでに登録されて入ればスキップする
            next()
        }
    },
    (session, result, next) => {
        if (result.response) {
            session.dialogData.profile.name = result.response
        }
        if (!session.dialogData.profile.age) {
            builder.Prompts.number(session, `あなた何歳ですか？`)
        } else {
            next()
        }
    },
    (session, result) => {
        if (result.response) {
            session.dialogData.profile.age = result.response
        }
        // 3. ウォーターフォールを終了して結果を親のウォーターフォールに返す
        session.endDialogWithResult({ response: session.dialogData.profile })
    }
])