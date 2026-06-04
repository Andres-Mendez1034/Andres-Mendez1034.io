import axios from "axios";

const API_URL = "https://brandconnect.azurewebsites.net/api/auth";

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};

export const verifyEmail = async (token) => {
  const res = await axios.get(`${API_URL}/verify-email`, {
    params: { token },
  });
  return res.data;
};

export const getMFAQR = async (email) => {
  const res = await axios.post(`${API_URL}/mfa/qr`, { email });
  return res.data;
};

export const verifyMFA = async ({ email, token }) => {
  const res = await axios.post(`${API_URL}/verify-mfa`, { email, token });
  return res.data;
};
