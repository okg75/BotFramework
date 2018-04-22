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
    session.send({
        "type": "message",
        "text": "Plain text is ok, but sometimes I long for more...",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                        {
                            "type": "TextBlock",
                            "text": "Hello World!",
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "*Sincerely yours,*"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Adaptive Cards",
                            "separation": "none"
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.OpenUrl",
                            "url": "http://adaptivecards.io",
                            "title": "Learn More"
                        }
                    ]
                }
            }
        ]
    })

})


