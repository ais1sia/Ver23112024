import React from "react"
import { render } from "react-dom"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { selectMaterialById } from "./materialsApiSlice"
import { useRateMaterialMutation } from "./materialsApiSlice"
import useAuth from "../../hooks/useAuth"
import "@fortawesome/fontawesome-free/css/all.min.css";


const ViewMaterial = () => {
  const { id } = useParams()
  const { userId } = useAuth()

  const [rateMaterial] = useRateMaterialMutation()

  const material = useSelector((state) => selectMaterialById(state, id));

  if (!material) {
    return <p>Material not found!</p>;
  }

  const { title, imageUrl, content, sourceUrl } = material;

  //21.01.2025
  //const rating = useState(0)
  const handleRate = async (rating) => {
    try {
      await rateMaterial({ id: id, rating, userId: userId }).unwrap()
    } catch (err) {
      console.error("Failed to rate material:", err);
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
      <div>
        <h2>Oceń materiał:</h2>
        <ReactStars
          count={5}
          value={material.rating || 0}
          onChange={handleRate}
          size={200}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fas fa-star-half-alt"></i>}
          fullIcon={<i className="fas fa-star"></i>}
          activeColor="#ffd700"
        />
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
};

export default ViewMaterial;