const builder = require('botbuilder');

const connector = new builder.ConsoleConnector().listen();
const bot = new builder.UniversalBot(connector, (session) => {
    const name = session.message.user.name
    const text = session.message.text
    session.send(`${name}さんが「${text}」と言いました`);
});