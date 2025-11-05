import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const S3Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchS3Images = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/s3`);
      setImages(res.data || []);
    } catch (err) {
      console.error("Error fetching S3 images:", err);
      alert("Failed to fetch S3 images. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchS3Images();
  }, []);

  const toggleSelect = (url) => {
    const key = url.split("/").pop();
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

const deleteSelected = async () => {
  if (selectedKeys.length === 0) {
    alert("Select 4 images to delete.");
    return;
  }

  if (selectedKeys.length !== 4) {
    alert("Please select exactly 4 images to delete.");
    return;
  }

  if (!window.confirm("Are you sure you want to delete these 4 images from FarCloud?")) {
    return;
  }

  setLoading(true);
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/delete`, {
      data: { keys: selectedKeys },
    });
    alert("Successfully deleted 4 images from S3.");
    setSelectedKeys([]);
    fetchS3Images();
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete images. Check backend.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="s3-container">
      <div className="section-header" style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Uploaded images</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-danger"
            onClick={deleteSelected}
            disabled={selectedKeys.length === 0 || loading}
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div className="image-section">
        <div className="image-grid">
          {images.length === 0 && !loading && <div style={{ color: "#666" }}>No images in bucket</div>}
          {images.map((url) => {
            const key = url.split("/").pop();
            const isSelected = selectedKeys.includes(key);
            return (
              <div
                key={key}
                className={`image-card ${isSelected ? "selected" : ""}`}
                onClick={() => toggleSelect(url)}
                title={key}
              >
                <img src={url} alt={key} loading="lazy" />
                <div style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  background: "rgba(0,0,0,0.5)",
                  padding: "4px 8px",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 11
                }}>
                  {key.length > 20 ? key.slice(0, 18) + "…" : key}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 12 }}>
        <div style={{ color: "#555" }}>{images.length} items</div>
        <div style={{ color: "#555" }}>{selectedKeys.length} selected</div>
      </div>
    </div>
  );
};

export default S3Gallery;
