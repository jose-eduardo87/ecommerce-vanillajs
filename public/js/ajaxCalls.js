import "regenerator-runtime/runtime"; // USED TO POLYFILL ASYNC FUNCTIONS
import axios from "axios";
import { showAlert } from "./alerts";

export const sendData = async (data, endpoint) => {
  try {
    const response = await axios.post(`/api/v1${endpoint}`, data);

    if (endpoint.includes("login")) {
      return setTimeout(() => location.assign("/"), 3000);
    }

    return response.data;
  } catch (err) {
    showAlert("error", err.response.data.message, 5);
  }
};

export const loadData = async (endpoint) => {
  try {
    const response = await axios.get(`/api/v1${endpoint}`);

    return response.data;
  } catch (err) {
    showAlert("error", err.message.data.message, 5);
  }
};

export const updateData = async (data, endpoint) => {
  try {
    const res = await axios.patch(`/api/v1${endpoint}`, data);
    showAlert("success", "Cart updated successfully!", 4);

    return res;
  } catch (err) {
    showAlert("error", err.response.data.message, 5);
  }
};

export const deleteData = async (endpoint) => {
  try {
    await axios.delete(`/api/v1${endpoint}`);
  } catch (err) {
    showAlert("error", err.response.data.message, 5);
  }
};
