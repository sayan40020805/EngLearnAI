import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar"; // Import the Navbar component
import "../styles/YouTubeFetcher.css";

const YouTubeFetcher = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef();

  const fetchVideos = async (token = "", query = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/youtube/videos`, {
        params: {
          pageToken: token,
          query: query,
        },
      });
      console.log("API Response:", res.data); // Log the response for debugging

      const fetchedVideos = res?.data?.videos;
      if (Array.isArray(fetchedVideos)) {
        setVideos((prev) => [...prev, ...fetchedVideos]);
        setNextPageToken(res.data.nextPageToken || null);
      } else {
        throw new Error("Invalid response format: 'videos' is not an array");
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to load videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setVideos([]); // Clear previous videos
    setNextPageToken(null); // Reset pagination
    fetchVideos("", searchQuery); // Fetch videos with the search query
  };

  useEffect(() => {
    fetchVideos(); // Initial fetch
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        window.innerHeight + window.scrollY >=
          containerRef.current.scrollHeight - 200 &&
        nextPageToken &&
        !loading
      ) {
        fetchVideos(nextPageToken); // Load more videos
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loading]);

  return (
    <div className="youtube-fetcher" ref={containerRef}>
      {/* <Navbar /> Include the Navbar */}
      <h2>YouTube Videos</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="video-grid">
        {videos.map((video, idx) => (
          <div className="video-card" key={idx}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <div className="video-title">{video.title}</div>
          </div>
        ))}
      </div>
      {loading && <p>Loading more videos...</p>}
    </div>
  );
};

export default YouTubeFetcher;
