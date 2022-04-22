'use strict';

module.exports = function(app) {
  const { DataTypes: { BIGINT, TEXT, STRING } } = app.model;
  const Schemas = app.model.define('Schemas', {
    id: { type: BIGINT, autoIncrement: true },
    router: { type: STRING },
    icon: { type: STRING },
    name: { type: STRING },
    schema: TEXT,
  });
  return Schemas;
};
