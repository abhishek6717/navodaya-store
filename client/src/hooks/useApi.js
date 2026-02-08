import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Custom hook for API requests with error handling
 * @param {string} url - The API endpoint
 * @param {object} config - Axios config (optional)
 * @returns {object} - { data, loading, error, handleRequest }
 */
export const useApi = (url, config = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(
    async (method = 'get', payload = null, customConfig = {}) => {
      try {
        setLoading(true);
        setError(null);

        const finalConfig = {
          ...config,
          ...customConfig,
          method,
          url: apiUrl + url,
        };

        if (payload) {
          finalConfig.data = payload;
        }

        const response = await axios(finalConfig);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        
        // Only show toast if not explicitly disabled
        if (customConfig?.showToast !== false) {
          toast.error(errorMessage);
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, config]
  );

  return { data, loading, error, handleRequest };
};

/**
 * Custom hook for form submissions with validation
 */
export const useFormSubmit = (onSubmit, onError) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setErrors({});
        await onSubmit(formData);
      } catch (err) {
        const errorObj = err.response?.data?.errors || { submit: err.message };
        setErrors(errorObj);
        if (onError) onError(errorObj);
      } finally {
        setLoading(false);
      }
    },
    [onSubmit, onError]
  );

  return { loading, errors, handleSubmit };
};
