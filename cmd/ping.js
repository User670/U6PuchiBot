exports.run = (client, message, args) => {
    message.channel.send(":ping_pong: Pong! " + message.author).catch(console.error);
}