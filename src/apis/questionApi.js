import axiosClient from './axiosClient';

const BASE_LINK = '/question';

export const countAll = () => {
  const url = `${BASE_LINK}/count-all`;
  return axiosClient.get(url);
};

export const getAll = () => {
  const url = `${BASE_LINK}/all`;
  return axiosClient.get(url);
};

export const getPagination = ({ _limit, _page, searchTerm, level }) => {
  const url = `${BASE_LINK}?_page=${_page}&_limit=${_limit}&search_term=${searchTerm}&level=${level}`;
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

export const addList = (data) => {
  const url = `${BASE_LINK}/any`;
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
