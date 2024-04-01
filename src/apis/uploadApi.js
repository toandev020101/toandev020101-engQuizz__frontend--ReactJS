import axiosClient from './axiosClient';

const BASE_LINK = '/upload';

export const uploadFile = (formData) => {
  const url = `${BASE_LINK}`;
  return axiosClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
