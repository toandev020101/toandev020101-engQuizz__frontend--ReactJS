import axiosClient from './axiosClient';

const BASE_LINK = '/user';

export const getPagination = ({ _limit, _page, searchTerm, gender, isAdmin }) => {
  const url = `${BASE_LINK}?_page=${_page}&_limit=${_limit}&search_term=${searchTerm}&gender=${gender}&is_admin=${isAdmin}`;
  return axiosClient.get(url);
};

export const getOneById = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.get(url);
};

export const addOne = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.post(url, data);
};

export const updateOne = ({ id, data }) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.put(url, data);
};

export const changeIsAdmin = ({ id, is_admin }) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.patch(url, { is_admin });
};

export const removeOne = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.delete(url);
};

export const removeAny = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.delete(url, { data });
};
