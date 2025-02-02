import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectMaterialById, useRateMaterialMutation, useMarkAsViewedMutation } from "./materialsApiSlice";
import useAuth from "../../hooks/useAuth";
import Rating from "@mui/material/Rating"; // Import Material-UI Rating
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import "@fortawesome/fontawesome-free/css/all.min.css";

const ViewMaterial = () => {
  const { id } = useParams()
  const { userId } = useAuth()
  const [rating, setRating] = useState(0)
  const [rateMaterial] = useRateMaterialMutation()
  const [markAsViewed] = useMarkAsViewedMutation()

  const navigate = useNavigate()

  const material = useSelector((state) => selectMaterialById(state, id))

  useEffect(() => {
    if (id && userId) {
      markAsViewed({ materialId: id, userId })
        .unwrap()
        .catch((err) => console.error("Failed to mark as viewed:", err));
    }
  }, [id, userId, markAsViewed]);

  if (!material) {
    return <p>Material not found!</p>
  }

  const { title, imageUrl, content, sourceUrl } = material

  const handleRate = async (event, newValue) => {
    setRating(newValue)
    try {
      await rateMaterial({ id, rating: newValue, userId }).unwrap()
      navigate("/dash/materials")
    } catch (err) {
      console.error("Failed to rate material:", err)
    }
  }

  return (
    <div style={styles.container}>
      {imageUrl && <img src={imageUrl} alt={title} style={styles.image} />}

      <h1 style={styles.title}>{title}</h1>

      <div
        style={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {sourceUrl && (
        <div style={styles.source}>
          <p>
            Source:{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {sourceUrl}
            </a>
          </p>
        </div>
      )}

      <div style={styles.ratingContainer}>
        <h3>Rate this content:</h3>
        <div style={{ marginTop: 10 }}>
          <Rating
            name="material-rating"
            value={rating}
            onChange={handleRate}
            precision={0.5}
            icon={<StarIcon style={{ fontSize: 30 }} />}
            emptyIcon={<StarBorderIcon style={{ fontSize: 30 }} />}
          />
        </div>
        <i>Rating helps us to choose the best content for You!</i>
      </div>

    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  content: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#444",
    marginBottom: "30px",
  },
  source: {
    fontSize: "0.9rem",
    textAlign: "center",
    color: "#666",
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
  },
  ratingContainer: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
};

export default ViewMaterial;
