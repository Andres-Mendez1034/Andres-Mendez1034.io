import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

/* =========================================================
   REGISTER
========================================================= */
export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

/* =========================================================
   LOGIN
========================================================= */
export const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};

/* =========================================================
   🔐 MFA QR (ESTE ES EL QUE TE FALTABA)
========================================================= */
export const getMFAQR = async (email) => {
  const res = await axios.post(`${API_URL}/mfa/qr`, { email });
  return res.data;
};

/* =========================================================
   🔐 VERIFY MFA (IMPORTANTE: RUTA CORRECTA)
========================================================= */
export const verifyMFA = async ({ email, token }) => {
  const res = await axios.post(`${API_URL}/verify-mfa`, {
    email,
    token,
  });

  return res.data;
};