// ALIAS COMMAND TO .roles

exports.run = (client, message, args) => {
   try {
    let cmdFile = require(`./roles.js`);
    cmdFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
}