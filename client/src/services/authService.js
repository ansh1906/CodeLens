import api from '../api/api';

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data||error; // Throw the error response data for handling in the component
  }
};

export const registerUser = async (name,email, password,type, targetLow, targetHigh) => {
  try {
    const response = await api.post('/auth/register', { name,email, password,type, targetLow, targetHigh }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data||error; // Throw the error response data for handling in the component
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await api.post('/auth/resend-otp', { email }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error; // Throw the error response data for handling in the component
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout', null, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMe = async () => {
  const response = await api.get('/auth/me', { withCredentials: true });
  return response.data;
};