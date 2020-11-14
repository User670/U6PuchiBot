// ALIAS COMMAND TO .role

exports.run = (client, message, args) => {
   try {
    let cmdFile = require(`./role.js`);
    cmdFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
}