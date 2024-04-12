import axiosClient from './axiosClient';

const BASE_LINK = '/exam';

export const getListByUserId = () => {
  const url = `${BASE_LINK}`;
  return axiosClient.get(url);
};

export const getOneById = (id) => {
  const url = `${BASE_LINK}/${id}`;
  return axiosClient.get(url);
};
