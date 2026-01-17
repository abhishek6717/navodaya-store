import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(
          `${apiUrl}/api/v1/auth/verify-email/${token}`
        );

        if (res.data.success) {
          toast.success("Email verified successfully!");
          navigate("/login");
        }
      } catch (err) {
        toast.error("Invalid or expired verification link");
        navigate("/register");
      }
    };

    verifyEmail();
  }, []);

  return <h3 style={{ textAlign: "center" }}>Verifying email...</h3>;
};

export default VerifyEmail;
