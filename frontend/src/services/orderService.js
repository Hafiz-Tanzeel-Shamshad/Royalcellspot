import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getOrders = async (token) => {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateOrderStatus = async (token, orderId, orderStatus) => {
  const response = await axios.put(
    `${API_URL}/orders/${orderId}/status`,
    { orderStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
