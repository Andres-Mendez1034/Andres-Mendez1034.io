// src/services/auth.service.js
import axios from "axios";

const API_URL = "http://localhost:3000";

export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Error register:", err.response?.data || err.message);
    throw err;
  }
};

export const login = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Error login:", err.response?.data || err.message);
    throw err;
  }
};

export const getMFAQR = async (email) => {
  const res = await axios.get(`${API_URL}/mfa/setup?email=${email}`);
  return res.data;
};

export const verifyMFA = async ({ email, token }) => {
  const res = await axios.post(`${API_URL}/mfa/verify`, { email, token });
  return res.data;
};