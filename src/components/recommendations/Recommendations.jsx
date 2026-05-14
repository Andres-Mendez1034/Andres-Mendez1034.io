import { useEffect, useState } from "react";
import "./Recommendations.css";
import StarRating from "./StarRating";

export default function Recommendations({ influencerId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // 🔥 MOCK DATA INICIAL
  useEffect(() => {
    const mockReviews = [
      { rating: 5, comment: "Increíble creador 🔥" },
      { rating: 4, comment: "Muy bueno el contenido" },
      { rating: 5, comment: "Recomendado 100%" }
    ];

    setReviews(mockReviews);
  }, []);

  const handleSubmit = () => {
    if (rating <= 0) return;

    const newReview = {
      rating,
      comment: comment || "Sin comentario"
    };

    // 🔥 SOLO FRONTEND (NO BACKEND)
    setReviews((prev) => [newReview, ...prev]);

    setRating(0);
    setComment("");
    setShowForm(false);
  };

  return (
    <section className="recommendations-container">
      <h2>
        {influencerId
          ? "Opiniones sobre este creador"
          : "Danos tu opinión"}
      </h2>

      <button
        type="button"
        className="toggle-form-btn"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Cerrar" : "Dejar opinión"}
      </button>

      {showForm && (
        <div className="recommendations-form">
          <StarRating rating={rating} setRating={setRating} />

          <textarea
            placeholder="Escribe un comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating <= 0}
          >
            Enviar
          </button>
        </div>
      )}

      <div className="carousel-wrapper">
        {reviews.length === 0 ? (
          <p className="cp-muted">No hay opiniones aún</p>
        ) : (
          <div className="carousel-track">
            {[...reviews, ...reviews].map((review, index) => (
              <div className="review-card" key={index}>
                <div className="stars">
                  {"⭐".repeat(review.rating || 0)}
                </div>
                <p className="comment">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}