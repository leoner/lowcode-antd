'use strict';

const Controller = require('egg').Controller;

class BlockController extends Controller {
  async createOrUpdate() {
    const { ctx } = this;
    const { id, schema, name } = ctx.params;
    console.info('======>', ctx.params);
    console.info('======>', ctx.request.body);

    let result;
    const updateObj = {};
    if (schema) {
      updateObj.schema = JSON.stringify(schema);
    }

    if (name) {
      updateObj.name = name;
    }

    if (id) {
      result = await ctx.app.model.Blocks.update({
        id,
      }, updateObj);
    } else {
      result = await ctx.app.model.Blocks.create(updateObj);
    }

    ctx.body = {
      success: true,
      id: result.id,
    };
  }

  async getBlock() {
    const { ctx } = this;
    const { id } = ctx.params;
    console.info('====>', id);
    if (id) {
      const schema = await this.ctx.model.Blocks.findOne({
        id,
      });

      const success = !!schema;
      ctx.body = {
        success,
        data: JSON.parse(schema.schema),
      };
      return;
    }

    ctx.body = {
      success: false,
      message: `Not found schema ${id}`,
    };
  }

  async list() {
    const { ctx } = this;
    const { id } = ctx.params;
    console.info('====>', id);
    const blocks = await this.ctx.model.Blocks.find();
    blocks.forEach(block => {
      block.schema = JSON.parse(block.schema);
    });

    ctx.body = {
      success: true,
      data: blocks,
    };
  }

  async delete() {
    const { id } = this.ctx.params;
    if (id) {
      const result = await this.ctx.model.Blocks.remove({
        id,
      });
      this.ctx.body = {
        success: true,
        result,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }
}

module.exports = BlockController;
