import axiosClient from './axiosClient';

const BASE_LINK = '/test';

export const getPagination = ({ _limit, _page, searchTerm, status }) => {
  const url = `${BASE_LINK}?_page=${_page}&_limit=${_limit}&search_term=${searchTerm}&status_test=${status}`;
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

export const removeOne = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.delete(url);
};

export const removeList = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.delete(url, { data });
};
