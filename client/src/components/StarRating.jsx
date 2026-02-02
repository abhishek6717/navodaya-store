import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          onClick={() => setRating(star)}
          color={star <= rating ? "#ffc107" : "#e4e5e9"}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );
};

export default StarRating;
