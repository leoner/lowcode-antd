'use strict';

module.exports = function(app) {
  const { DataTypes: { BIGINT, TEXT, STRING } } = app.model;
  const Users = app.model.define('Users', {
    id: { type: BIGINT, autoIncrement: true },
    name: { type: STRING },
    password: { type: STRING }, // md5
    nickname: { type: STRING },
  });
  return Users;
};
