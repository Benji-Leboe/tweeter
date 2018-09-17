"use strict";

const Chance = require("chance");
const chance = new Chance();
const jdenticon = require('jdenticon');
const fs = require('fs');
const md5 = require('md5');

function generateIcon(handle) {
  let size = 200;
  let value = `${handle}_icon`;
  let png = jdenticon.toPng(value, size);

  fs.writeFileSync(`../../../public/identicons/${handle}.png`, png);
}

module.exports = {

  generateRandomUser: () => {
    const gender    = chance.gender();
    const firstName = chance.first({gender: gender});
    const lastName  = chance.last();
    const userName  = firstName + " " + lastName;

    let userHandle = "@";
    if (Math.random() > 0.5) {
      let prefix    = chance.prefix({gender: gender});
      prefix = prefix.replace(".", "");
      userHandle += prefix
    }

    userHandle += lastName;

    if (Math.random() > 0.5) {
      const suffix = Math.round(Math.random() * 100);
      userHandle += suffix;
    }

    const avatarUrlPrefix = `https://vanillicon.com/${md5(userHandle)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    }

    return {
      name: userName,
      handle: userHandle,
      avatars: avatars
    };
  },
  generateUser: (oid, userName, handle, passHash) => {

    let userHandle = `@${handle}`;
    if (handle.slice(0,1) === "@"){
      userHandle += handle.slice(1);
    }
    generateIcon(handle);

    const avatarUrlPrefix = `../../../public/identicons/${handle}.png`;
    const avatars = {
      small:   `${avatarUrlPrefix}`
    }

    return {
      _id: oid,
      name: userName,
      handle: userHandle,
      password: passHash,
      avatars: avatars
    };

  }
};
