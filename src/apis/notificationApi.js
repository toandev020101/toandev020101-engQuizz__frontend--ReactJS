import axiosClient from './axiosClient';

const BASE_LINK = '/notification';

export const getListByUserId = () => {
  const url = `${BASE_LINK}`;
  return axiosClient.get(url);
};

export const getPagination = ({ _limit, _page, searchTerm }) => {
  const url = `${BASE_LINK}/pagination?_page=${_page}&_limit=${_limit}&search_term=${searchTerm}`;
  return axiosClient.get(url);
};

export const getOneById = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.get(url);
};

export const readAll = (id) => {
  const url = `${BASE_LINK}/read-all`;
  return axiosClient.get(url);
};

export const addOne = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.post(url, data);
};

export const removeOne = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.delete(url);
};

export const removeList = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.delete(url, { data });
};
