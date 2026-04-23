import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createLead = async ({ email, phone, source }) => {
  const response = await axios.post(`${API_URL}/leads`, {
    email,
    phone,
    source: source || 'add_to_cart',
  });

  return response.data;
};
