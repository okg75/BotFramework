const restify = require('restify')
const builder = require('botbuilder')
// 1. mongoDBを使用するためのモジュールを追加する
const MongoClient = require(`mongodb`).MongoClient

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

    }
]).set(`strage`, inMemoryStorage)

const registerReminder = (text, callback) => {

    MongoClient.connect(C.DB_URL, (err, client) => {
        if (err) {
            console.log(`upsertWork: エラー：${err}`)
            callback(err, null)
            return
        }

        try {
            const db = client.db(C.DB_NAME)
            const col = db.collection(`works`)

            col.findOneAndUpdate(
                {
                    worktimeId: work.worktimeId,
                    userId: work.userId
                }, {
                    $set: work
                }, {
                    returnOriginal: false,
                    upsert: true
                },
                (err, r) => {
                    callback(err, r)
                })

        } catch (e) {
            console.log(`upsertWork: e = ${e}`);
            client.close()
            callback(err)
        }
    })
}