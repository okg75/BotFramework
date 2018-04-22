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
        session.send(`君かわいいね（笑）`)
        builder.Prompts.text(session, `どこ住み？`)
    },
    (session, result) => {
        // 2. 結果を受け取ってdialogDataに保存する
        session.dialogData.live = result.response
        // 3. 選択肢のあるPromptを作成する
        builder.Prompts.choice(session,
            `会える？`,
            `会える|会えない|無視`,
            { listStyle: builder.ListStyle.inline })
    },
    (session, result) => {
        session.dialogData.isMeet1 = result.response.entity
        // 4. 数字を入力させる
        builder.Prompts.number(session, `何歳？`)
    },
    (session, result) => {
        session.dialogData.age = result.response
        builder.Prompts.choice(session,
            `今暇？`,
            [`暇`, `忙しい`, `無視`],
            { listStyle: builder.ListStyle.list })
    },
    (session, result) => {
        session.dialogData.isFreeTime = result.response.entity
        builder.Prompts.choice(session,
            `会わない？`,
            `会える|会えない|無視`,
            { listStyle: builder.ListStyle.button })
    },
    (session, result) => {
        session.dialogData.isMeet2 = result.response.entity
        builder.Prompts.confirm(session, `てかLINEやってる？`)
    },
    (session, result) => {
        session.dialogData.isLINE = result.response

        // 5. 入力されたデータを取得する
        var message = `どこ住み：${session.dialogData.live}<br/>`
        message += `会える(1度目)：${session.dialogData.isMeet1}<br/>`
        message += `何歳：${session.dialogData.age}<br/>`
        message += `今暇？：${session.dialogData.isFreeTime}<br/>`
        message += `会わない？（２度目）：${session.dialogData.isMeet2}<br/>`
        message += `てかLINEやってる？：${session.dialogData.isLINE}<br/>`
        session.send(message)
        session.endDialog()
    }
]).set(`strage`, inMemoryStorage)