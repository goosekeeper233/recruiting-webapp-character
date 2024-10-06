import axios from "axios";

const API_BASE_URL = "https://recruiting.verylongdomaintotestwith.ca/api";
const GITHUB_USERNAME = "goosekeeper233";

export const saveCharacters = async (characters) => {
  return await axios
    .post(`${API_BASE_URL}/${GITHUB_USERNAME}/character`, characters, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Success:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};

export const getCharacters = async () => {
  return await axios
    .get(`${API_BASE_URL}/${GITHUB_USERNAME}/character`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Success:", response.data);
      return response.data.body;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};
