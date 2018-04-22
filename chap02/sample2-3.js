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
    session.send(`こんにちは！`)

    // 1. ダイアログの開始
    session.beginDialog(`greetings`)
})

// 2. ウォーターフォールによる会話を作成
bot.dialog(`greetings`, [
    (session) => {
        // 3. Promptで入力を待つ
        var message = `今日の調子はいかがですか？<br/>`
        message += `・良い<br/>`
        message += `・そこそこ<br/>`
        message += `・悪い<br/>`
        builder.Prompts.text(session, message)
    },
    (session, results) => {
        // 4. 入力の結果を受けて応答をさらに返す
        switch (results.response) {
            case `良い`:
                session.endDialog(`素晴らしいです！はりきっていきましょう！`)
                break
            case `そこそこ`:
                session.endDialog(`そうですか、良いことがあるといいですね！`)
                break
            case `悪い`:
                session.endDialog(`それはいけませんね！今日はのんびり過ごしましょう！`)
                break
            default:
                session.endDialog(`およよ＞＜`)
        }
    }
]
)
