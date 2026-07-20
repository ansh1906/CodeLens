import axios from "axios";

export async function analyzeRepo(repoUrl) {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/analyze",
      { repoUrl }
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      "Failed to analyze repository"
    );
  }
}
