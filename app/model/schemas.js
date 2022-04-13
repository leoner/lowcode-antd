
   
'use strict';

module.exports = function(app) {
  const { DataTypes: { BIGINT, TEXT } } = app.model;
  console.info('========>schema-----');
  const Schemas = app.model.define('Schemas', {
    id: { type: BIGINT, autoIncrement: true },
    content: TEXT,
  });
  return Schemas;
};
