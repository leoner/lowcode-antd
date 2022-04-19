'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async add() {
    const { ctx } = this;
    const user = await ctx.app.model.Users.create(ctx.params);
    console.info('user find ---->', user);
    ctx.session.user = user;
    ctx.body = {
      success: true,
      name: ctx.params.name,
    }
  }

  async login() {
    // 1. 检查用户如果， 存在登录成功， 如果不存在注册用户
    const { ctx } = this;
    console.info('========>', ctx.params);
    const { name, password } = ctx.params;
    const user = await ctx.app.model.Users.findOne({
      name,
    });
    if (!user) {
      return this.add(this.params);
    }

    if (user && user.password === password) {
      ctx.session.user = user;
      ctx.body = {
        success: true,
        status: 1,
        name: user.name,
      }
    } else {
      ctx.body = {
        status: 0,
        success: true,
      }
    }
  }

  async getUser() {
    this.ctx.body = {
      name: 'leoner',
      avator: 'http://',
      email: 'leoner@gmail.com'
    }
  }
}

module.exports = UserController;
