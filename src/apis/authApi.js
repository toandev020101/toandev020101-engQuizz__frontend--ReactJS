import axiosClient from './axiosClient';

const BASE_LINK = '/auth';

export const login = (data) => {
  const url = `${BASE_LINK}/login`;
  return axiosClient.post(url, data);
};

export const register = (data) => {
  const url = `${BASE_LINK}/register`;
  return axiosClient.post(url, data);
};

export const verifyEmail = ({ token }) => {
  const url = `${BASE_LINK}/verify-email/${token}`;
  return axiosClient.get(url);
};

export const resendEmail = ({ userId }) => {
  const url = `${BASE_LINK}/resend-email/${userId}`;
  return axiosClient.get(url);
};

export const refreshToken = () => {
  const url = `${BASE_LINK}/refresh-token`;
  return axiosClient.get(url);
};

export const logout = () => {
  const url = `${BASE_LINK}/logout`;
  return axiosClient.get(url);
};
