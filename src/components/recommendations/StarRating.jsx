import { useState } from "react";
import "./Recommendations.css"; // puedes separarlo si quieres

export default function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = hover >= star || rating >= star;

        return (
          <span
            key={star}
            className={`star ${isActive ? "active" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}