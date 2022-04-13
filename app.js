'use strict'
// app.js

module.exports = class LowcodeApp {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    if (this.app.config.env === 'local') {
      // ⚠️ 此操作可能导致数据丢失，请务必谨慎使用
      await this.app.model.sync({ alter: true });
    }
  }
};

