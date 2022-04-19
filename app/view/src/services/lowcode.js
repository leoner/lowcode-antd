import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

export async function getLowcodePageList(params, options) {
  return request('/api/schema', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

export async function getSchema(id, options) {
  const result = await request(`/api/schema/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
  return result?.data;
}

export async function getDefaultSchemaId() {
  const result = await request(`/api/schema/`, {
    method: 'GET',
    params: {},
  });

  return result?.data[0].id;
}

export async function addSchema(params, options) {
  return request('/api/schema/', {
    method: 'POST',
    params: { ...params },
    ...(options || {}),
  });
}

export async function updateSchema(params, options = {}) {
  return request(`/api/schema/${params.id}`, {
    method: 'POST',
    data: {
      schema: params.schema,
    },
    ...options,
  });
}

export async function deletePage(id) {
  return request(`/api/schema/delete`, {
    method: 'POST',
    params: {id},
  });
}