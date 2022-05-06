import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

export async function listBlocks(params, options) {
  const result = await request('/api/blocks', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  return result.data || [];
};


export async function getBlock(id, options) {
  const result = await request(`/api/block/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
  return result?.data;
}

export async function createBlock(params, options) {
  return request('/api/blocks/', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

export async function updateSchema(params, options = {}) {
  return request(`/api/blocks/${params.id}`, {
    method: 'POST',
    data: {
      schema: params.schema,
    },
    ...options,
  });
}

export async function deleteBlock(id) {
  return request(`/api/blocks/delete`, {
    method: 'POST',
    params: {id},
  });
}