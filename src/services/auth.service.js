// src/services/auth.service.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth"; // ⚠️ ajusta puerto si es otro

export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    return res.data;
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    throw err.response?.data || new Error("Error en registro");
  }
};

export const login = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    return res.data;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    throw err.response?.data || new Error("Error en login");
  }
};

export const getMFAQR = async (email) => {
  try {
    const res = await axios.post(`${API_URL}/mfa/qr`, { email });
    return res.data;
  } catch (err) {
    console.error("MFA QR ERROR:", err);
    throw err.response?.data || new Error("Error generando QR");
  }
};

export const verifyMFA = async ({ email, token }) => {
  try {
    const res = await axios.post(`${API_URL}/mfa/verify`, { email, token });
    return res.data;
  } catch (err) {
    console.error("MFA VERIFY ERROR:", err);
    throw err.response?.data || new Error("Error verificando MFA");
  }
};