'use strict';

const Controller = require('egg').Controller;

class SchemaController extends Controller {
  async createOrUpdate() {
    const { ctx } = this;
    const { id, schema } = ctx.params;
    console.info('------>', id);
    let result;
    if (id) {
      result = await ctx.app.model.Schemas.update({
        id: 3,
      }, {
        content: JSON.stringify(schema),
      });

      console.info('====>', id, typeof id, result);
    } else {
      result = await ctx.app.model.Schemas.create({
        content: JSON.stringify(ctx.request.body),
      });
    }

    ctx.body = {
      success: true,
      id: result.id,
    };
  }

  async getSchema() {
    const { ctx } = this;
    const { id } = ctx.params;
    console.info('====>', id);
    if (id) {
      const schema = await this.ctx.model.Schemas.findOne({
        id,
      });

      const success = !!schema;
      ctx.body = {
        success,
        data: JSON.parse(schema.content),
      };
      return;
    }

    ctx.body = {
      success: false,
      message: `Not found schema ${id}`,
    };
  }
}

module.exports = SchemaController;
