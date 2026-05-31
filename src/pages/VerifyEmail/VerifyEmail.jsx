import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { verifyEmail as verifyEmailService } from "../../services/auth.service";
import "./VerifyEmail.css";

export default function VerifyEmail() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { confirmEmail } = useContext(AuthContext);

  const [status,  setStatus]  = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("El enlace no es válido.");
      return;
    }

    verifyEmailService(token)
      .then((data) => {
        confirmEmail(data);
        setStatus("success");
        setTimeout(() => navigate("/mfa-setup"), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
          err?.message ||
          "El enlace es inválido o ya expiró."
        );
      });
  }, []);

  return (
    <div className="verify-email">
      <div className="verify-email__card">

        {status === "loading" && (
          <>
            <p className="verify-email__icon">⏳</p>
            <h2 className="verify-email__title">Verificando tu correo...</h2>
            <p className="verify-email__text">Un momento por favor.</p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="verify-email__icon">✅</p>
            <h2 className="verify-email__title">¡Correo verificado!</h2>
            <p className="verify-email__text">
              Redirigiendo para configurar tu autenticador...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="verify-email__icon">❌</p>
            <h2 className="verify-email__title">Enlace inválido</h2>
            <p className="verify-email__text verify-email__text--mb">
              {message}
            </p>
            <button
              className="verify-email__button"
              onClick={() => navigate("/register")}
            >
              Volver al registro
            </button>
          </>
        )}

      </div>
    </div>
  );
}