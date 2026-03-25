import axios from "axios";
import type { Order } from "../types/order";

const API_URL = "http://localhost:8000";

export const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get<Order[]>(`${API_URL}/orders`);
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axios.get<Order>(`${API_URL}/orders/${id}`);
  return response.data;
};

export const createOrder = async (order: Order) => {
  const response = await axios.post(`${API_URL}/orders`, order);
  return response.data;
};

export const updateOrder = async (id: string, order: Order) => {
  const response = await axios.put(`${API_URL}/orders/${id}`, order);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await axios.delete(`${API_URL}/orders/${id}`);
  return response.data;
};