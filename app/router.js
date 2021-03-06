'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/schema', controller.schema.createOrUpdate);
  router.get('/api/schema', controller.schema.list);
  router.post('/api/schema/delete', controller.schema.delete);
  router.get('/api/schema/:id', controller.schema.getSchema);
  router.post('/api/schema/:id', controller.schema.createOrUpdate);
  router.get('/', controller.home.index);
  router.post('/api/login', controller.user.login);
  router.get('/api/user/detail', controller.user.getUser);

  /** lowcode block start */

  router.get('/api/blocks', controller.blocks.list);
  router.post('/api/blocks', controller.blocks.createOrUpdate);

  /** lowcode block end*/

  router.get('*', controller.home.index);
};
