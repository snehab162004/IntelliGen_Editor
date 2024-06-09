import axios from 'axios';

const API_URL = "https://api-inference.huggingface.co/models/bigcode/starcoder2-15b";
const headers = { "Authorization": "Bearer" };

export const generateCode = async (payload) => {
  try {
    const response = await axios.post(API_URL, payload, { headers });
    if (Array.isArray(response.data) && response.data[0].hasOwnProperty('generated_text')) {
      return response.data[0].generated_text;
    } else {
      throw new Error('Unable to generate text.');
    }
  } catch (error) {
    console.error("Error querying the API:", error);
    throw error;
  }
};
