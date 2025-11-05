import React, { useState } from "react";
import "./App.css";
import PicsumGallery from "./components/PicsumGallery";
import S3Gallery from "./components/S3Gallery";

function App() {
  const [view, setView] = useState("picsum");

  const handleSwitch = (newView) => {
    setView(newView);
    if (newView === "picsum") {
      window.dispatchEvent(new Event("refreshPicsum"));
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1
          className="app-title"
          onClick={() => handleSwitch("picsum")}
        >
          FarCloud
        </h1>

        <nav className="nav-tabs">
          <button
            className={`nav-btn ${view === "picsum" ? "active" : ""}`}
            onClick={() => handleSwitch("picsum")}
          >
            Images
          </button>
          <button
            className={`nav-btn ${view === "s3" ? "active" : ""}`}
            onClick={() => handleSwitch("s3")}
          >
            S3 Bucket
          </button>
        </nav>
      </header>

      <main style={{ paddingTop: 24 }}>
        {view === "picsum" ? <PicsumGallery /> : <S3Gallery />}
      </main>
    </div>
  );
}

export default App;
