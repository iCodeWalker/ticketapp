import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);

      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log(err, "err.response?.data");
      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {err.response?.data?.errors?.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>,
      );

      //   throw err;
    }
  };

  return { doRequest, errors };
};

export default useRequest;
