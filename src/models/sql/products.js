const knex = require('../../db/knex');

const table = 'products';

exports.list = async (limit = 100) => {
  return knex.select('*').from(table).limit(limit);
};

exports.get = async (id) => {
  return knex.select('*').from(table).where('id', id).first();
};

exports.create = async (payload) => {
  const [row] = await knex(table).insert(payload).returning('*');
  return row;
};

exports.update = async (id, payload) => {
  const [row] = await knex(table).where('id', id).update({ ...payload, updated_at: knex.fn.now() }).returning('*');
  return row;
};

exports.remove = async (id) => {
  return knex(table).where('id', id).del();
};
