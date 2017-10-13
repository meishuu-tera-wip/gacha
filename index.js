const fs = require('fs');

module.exports = function Gacha(dispatch) {
  let name = '';
  let file = null;
  let copy = {};

  dispatch.hook('sLogin', (event) => {
    name = event.name;
    file = null;
  });

  dispatch.hook('cUseItem', (event) => {
    if (event.item === 166901) {
      copy = Object.assign({}, event);
    }
  });

  dispatch.hook('sGachaStart', (event) => {
    if (event.gachaItem === 166901) {
      dispatch.toServer('cGachaTry', event);
      return false;
    }
  });

  dispatch.hook('sGachaEnd', (event) => {
    if (!file) {
      file = fs.createWriteStream(`gacha-${name}-${Date.now()}.txt`, { flags: 'a' });
    }

    file.write(JSON.stringify(event) + '\n');
    dispatch.toServer('cUseItem', copy);
  });
};
