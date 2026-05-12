import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* =========================================================
   🟣 GET ALL INFLUENCERS / CREATORS
========================================================= */
export async function fetchInfluencers() {
  try {
    const res = await axios.get(`${API_URL}/profiles/creators`);

    return res.data?.profiles || [];
  } catch (error) {
    console.error("Error fetching influencers:", error);
    throw error;
  }
}

/* =========================================================
   🟣 CREATE CREATOR PROFILE
========================================================= */
export async function createCreatorProfile(data) {
  try {
    console.log("SENDING DATA:", data);

    const res = await axios.post(
      `${API_URL}/profiles/creator`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data?.profile;
  } catch (error) {
    console.error("Error creating creator profile:", error);
    throw error;
  }
}