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

const REG_EXP_VOTE_MESSAGE = /(^.+)ちゃんに投票しました/i

const bot = new builder.UniversalBot(connector, (session) => {
    var msg = new builder.Message(session)
    // 1. カルーセルを表示することを指定
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    // 2. ヒーローカードを作る
    msg.attachments([
        new builder.HeroCard(session)
            .title(`ひるみちゃん`)
            .subtitle(`ランチミーティングを仕切る`)
            .text(`好きな食べ物はオムライスです！`)
            .images([builder.CardImage.create(session, `http://localhost/hirumi.png`)])
            .buttons([builder.CardAction.imBack(session, `ひるみちゃんに投票しました`, `投票`)]),
        new builder.HeroCard(session)
            .title(`すかいぷちゃん`)
            .subtitle(`SkypeBotのなかみ`)
            .text(`本誌で出てくるのはここだけ！`)
            .images([builder.CardImage.create(session, `http://localhost/skypechang.png`)])
            .buttons([builder.CardAction.imBack(session, `すかいぷちゃんに投票しました`, `投票`)])
    ])
    session.send(msg)
})

// 3. ボタンがタップされたときのハンドラー
bot.dialog(`tappedButton`, (session, args) => {
    var message = args.intent.matched[0]
    var r = new RegExp(REG_EXP_VOTE_MESSAGE)
    var result = message.match(r)
    if (result && result.length > 0) {
        session.endDialog(`${result[1]}ちゃん頑張って！`)
    } else {
        session.endDialog(`エラー`)
    }
}).triggerAction({ matches: REG_EXP_VOTE_MESSAGE });
