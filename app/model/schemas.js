'use strict';

module.exports = function(app) {
  const { DataTypes: { BIGINT, TEXT, STRING } } = app.model;
  const Schemas = app.model.define('Schemas', {
    id: { type: BIGINT, autoIncrement: true },
    name: { type: STRING },
    content: TEXT,
  });
  return Schemas;
};
