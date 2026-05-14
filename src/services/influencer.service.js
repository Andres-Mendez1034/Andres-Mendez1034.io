import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* =========================================================
   GET MARKETPLACE
========================================================= */
export async function fetchInfluencers() {
  try {
    const res = await axios.get(`${API_URL}/marketplace`);
    return res.data?.profiles ?? res.data ?? [];
  } catch (error) {
    console.error("Error fetching marketplace:", error);
    return [];
  }
}

/* =========================================================
   GET CREATOR BY ID
========================================================= */
export async function fetchCreatorById(id) {
  try {
    const res = await axios.get(`${API_URL}/profiles/creator/${id}`);
    return res.data?.profile ?? res.data ?? null;
  } catch (error) {
    console.error("Error fetching creator profile:", error);
    console.error("RESPONSE DATA:", error?.response?.data);
    console.error("RESPONSE STATUS:", error?.response?.status);
    throw new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Error fetching creator profile"
    );
  }
}

/* =========================================================
   CREATE CREATOR PROFILE
========================================================= */
export async function createCreatorProfile(data) {
  try {
    const res = await axios.post(
      `${API_URL}/profiles/creator`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data?.profile ?? res.data;
  } catch (error) {
    console.error("Error creating creator profile:", error);
    console.error("RESPONSE DATA:", error?.response?.data);
    console.error("RESPONSE STATUS:", error?.response?.status);
    throw new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Error creating creator profile"
    );
  }
}

/* =========================================================
   GET REVIEWS BY CREATOR
========================================================= */
export async function fetchReviewsByCreator(influencerId) {
  try {
    const res = await axios.get(`${API_URL}/reviews/creator/${influencerId}`);
    return res.data?.reviews ?? res.data ?? [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

/* =========================================================
   POST REVIEW
========================================================= */
export async function postReview(influencerId, { rating, comment }) {
  try {
    const res = await axios.post(`${API_URL}/reviews/creator/${influencerId}`, {
      rating,
      comment,
    });
    return res.data?.review ?? res.data ?? null;
  } catch (error) {
    console.error("Error posting review:", error);
    throw new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Error al enviar la reseña"
    );
  }
}