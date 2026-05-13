import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* =========================================================
   🟣 GET MARKETPLACE (INFLUENCERS / CREATORS LIST)
========================================================= */
export async function fetchInfluencers() {
  try {
    const res = await axios.get(`${API_URL}/marketplace`);

    // Si el backend cambia estructura, evitamos romper UI
    return res.data?.profiles ?? res.data ?? [];
  } catch (error) {
    console.error("Error fetching marketplace:", error);

    // devolvemos array vacío para no romper React
    return [];
  }
}

/* =========================================================
   🟣 CREATE CREATOR PROFILE
========================================================= */
export async function createCreatorProfile(data) {
  try {
    const res = await axios.post(
      `${API_URL}/profiles/creator`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data?.profile ?? res.data;
  } catch (error) {
    console.error("Error creating creator profile:", error);

    // convertimos a error legible
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Error creating creator profile"
    );
  }
}