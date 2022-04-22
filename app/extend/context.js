'use strict';
module.exports = {
  success: obj => {
    console.info('-----<', obj);
    this.body = {
      success: true,
      ...obj,
    };
  },
};

