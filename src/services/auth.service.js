// src/services/auth.service.js (mock sin backend)
export const register = async (userData) => {
  console.log("Simulando registro:", userData);
  // devolvemos un usuario simulado
  return { id: 1, name: userData.name, email: userData.email };
};

export const login = async (userData) => {
  console.log("Simulando login:", userData);
  // devolvemos un usuario simulado
  return { id: 1, name: "Usuario Demo", email: userData.email };
};

export const getMFAQR = async (email) => {
  console.log("Simulando MFA QR para:", email);
  return { qrCode: "MOCK_QR_CODE" };
};

export const verifyMFA = async ({ email, token }) => {
  console.log("Simulando verificación MFA:", email, token);
  return { verified: true };
};