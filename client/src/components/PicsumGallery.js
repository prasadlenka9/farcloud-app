import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function PicsumGallery() {
  const [picsumImages, setPicsumImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const randomPage = Math.floor(Math.random() * 50) + 1;
    axios
      .get(`https://picsum.photos/v2/list?page=${randomPage}&limit=20`)
      .then((res) => setPicsumImages(res.data))
      .catch((err) => console.error("Error loading Picsum:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleImageSelect = (url) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter((img) => img !== url));
    } else if (selectedImages.length < 4) {
      setSelectedImages([...selectedImages, url]);
    } else {
      alert("You can select only 4 images at a time");
    }
  };

  const uploadToS3 = async () => {
    if (selectedImages.length !== 4) {
      alert("Select exactly 4 images to upload");
      return;
    }

    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/`);
    } catch {
      alert("Backend not reachable. Please start the server before uploading.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        { images: selectedImages },
        { timeout: 120000 }
      );
      alert(response.data.message || "Images uploaded successfully");
      setSelectedImages([]);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Upload failed. Check backend connection.");
      }
      console.error(err);
    }
  };

  return (
    <div className="picsum-container">
      {loading ? (
        <div className="skeleton-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="image-grid">
            {picsumImages.map((img) => (
              <div
                key={img.id}
                className={`image-card ${
                  selectedImages.includes(img.download_url) ? "selected" : ""
                }`}
                onClick={() => toggleImageSelect(img.download_url)}
              >
                <img
                  src={`https://picsum.photos/id/${img.id}/400/300`}
                  alt="Picsum"
                />
              </div>
            ))}
          </div>

          <button className="btn-gradient" onClick={uploadToS3}>
            Upload to FarCloud
          </button>
        </>
      )}
    </div>
  );
}

export default PicsumGallery;
