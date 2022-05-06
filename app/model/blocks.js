'use strict';

module.exports = function(app) {
  const { DataTypes: { BIGINT, TEXT, STRING } } = app.model;
  const Blocks = app.model.define('Blocks', {
    id: { type: BIGINT, autoIncrement: true },
    name: { type: STRING },
    title: { type: STRING },
    schema: TEXT,
    screenshot: { type: STRING},
  });
  return Blocks;
};
