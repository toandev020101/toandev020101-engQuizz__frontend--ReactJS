import axiosClient from './axiosClient';

const BASE_LINK = '/exam';

export const getAll = () => {
  const url = `${BASE_LINK}/all`;
  return axiosClient.get(url);
};

export const countAll = () => {
  const url = `${BASE_LINK}/count-all`;
  return axiosClient.get(url);
};

export const getListByUserId = () => {
  const url = `${BASE_LINK}`;
  return axiosClient.get(url);
};

export const getListSubmitByUserId = () => {
  const url = `${BASE_LINK}/submit`;
  return axiosClient.get(url);
};

export const getPagination = ({ _limit, _page, searchTerm, score, correctQuantity }) => {
  const url = `${BASE_LINK}/pagination?_page=${_page}&_limit=${_limit}&search_term=${searchTerm}&score=${score}&correct_quantity=${correctQuantity}`;
  return axiosClient.get(url);
};

export const getOneById = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.get(url);
};

export const removeOne = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.delete(url);
};

export const removeList = (data) => {
  const url = `${BASE_LINK}`;
  return axiosClient.delete(url, { data });
};
