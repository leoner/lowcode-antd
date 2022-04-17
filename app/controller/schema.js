'use strict';

const Controller = require('egg').Controller;

class SchemaController extends Controller {
  async createOrUpdate() {
    const { ctx } = this;
    const { id, schema, name } = ctx.params;
    console.info('======>', ctx.params);
    console.info('======>', ctx.request.body);

    let result;
    const updateObj = {};
    if (schema) {
      updateObj.content = JSON.stringify(schema);
    }

    if (name) {
      updateObj.name = name;
    }

    if (id) {
      result = await ctx.app.model.Schemas.update({
        id,
      }, updateObj);
    } else {
      result = await ctx.app.model.Schemas.create(updateObj);
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

  async list() {
    const { ctx } = this;
    const { id } = ctx.params;
    console.info('====>', id);
    const schemas = await this.ctx.model.Schemas.find();
    schemas.forEach(schema => {
      schema.content = JSON.parse(schema.content);
    });

    ctx.body = {
      success: true,
      data: schemas,
    };
  }

  async delete() {
    const { id } = this.ctx.params;
    if (id) {
      const result = await this.ctx.model.Schemas.remove({
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

module.exports = SchemaController;
