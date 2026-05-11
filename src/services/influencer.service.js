import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* =========================================================
   🟣 CREATE CREATOR PROFILE (FIXED)
   - SOLO JSON (NO FORM DATA)
========================================================= */
export async function createCreatorProfile(data) {
  try {
    console.log("SENDING DATA:", data);

    const res = await axios.post(
      `${API_URL}/profiles/creator`,
      data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return res.data?.profile;

  } catch (error) {
    console.error("Error creating creator profile:", error);
    throw error;
  }
}