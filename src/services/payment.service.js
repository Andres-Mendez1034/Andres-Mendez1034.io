import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("bc_token");

/* =========================================================
   CREATE SUBSCRIPTION CHECKOUT
========================================================= */
export async function createCheckout({ planName }) {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_URL}/subscriptions/checkout`,
      { planName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

/* =========================================================
   GET BILLING STATUS
========================================================= */
export async function getBillingStatus() {
  try {
    const token = getToken();

    const response = await axios.get(
      `${API_URL}/payments/billing-status`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching billing status:", error);
    throw error;
  }
}

/* =========================================================
   GET PAYMENT HISTORY
========================================================= */
export async function getPaymentHistory() {
  try {
    const token = getToken();

    const response = await axios.get(
      `${API_URL}/payments/history`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
}

const paymentService = {
  createCheckout,
  getBillingStatus,
  getPaymentHistory,
};

export default paymentService;