import axios from "axios";

export async function analyzeRepo(repoUrl) {
  const { data } = await axios.post("http://localhost:8787/api/analyze", { repoUrl });
  return data;
}
