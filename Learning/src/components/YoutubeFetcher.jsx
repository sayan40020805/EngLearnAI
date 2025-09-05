import React, { useEffect, useState, useRef, useCallback } from "react";
import API from "../utils/api";
import Navbar from "./Navbar"; // Import the Navbar component
import "../styles/YoutubeFetcher.css";

const YouTubeFetcher = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(null); // null: checking, true: available, false: unavailable
  const containerRef = useRef();

  const fetchVideos = useCallback(async (token = "", query = "", retryAttempt = 0) => {
    if (backendAvailable === false) {
      setError("Backend server is currently unavailable. Please try again later.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/api/youtube/videos`, {
        params: {
          pageToken: token,
          query: query,
        },
        timeout: 10000, // 10 second timeout
      });

      // Check if response is HTML (indicating backend issue)
      if (typeof res.data === 'string' && res.data.includes('<!doctype html')) {
        throw new Error("Backend server returned HTML instead of JSON. The YouTube API endpoint may not be available.");
      }

      // Check if response data exists
      if (!res.data) {
        throw new Error("No data received from server. Please check your internet connection.");
      }

      const fetchedVideos = res.data.videos || res.data.items || res.data.results;

      if (!Array.isArray(fetchedVideos)) {
        console.error("Invalid response structure:", res.data);
        throw new Error(`Invalid response format. Expected array of videos, got: ${typeof fetchedVideos}`);
      }

      if (fetchedVideos.length === 0) {
        if (!token) {
          setError("No videos found. Try a different search term.");
        }
        return;
      }

      // Validate video objects
      const validVideos = fetchedVideos.filter(video => {
        if (!video || typeof video !== 'object') {
          return false;
        }
        if (!video.videoId && !video.id) {
          return false;
        }
        if (!video.title) {
          return false;
        }
        return true;
      });

      console.log(`Successfully fetched ${validVideos.length} valid videos out of ${fetchedVideos.length}`);

      setVideos(prev => token ? [...prev, ...validVideos] : validVideos);
      setNextPageToken(res.data.nextPageToken || res.data.nextPage || null);
      setRetryCount(0); // Reset retry count on success

    } catch (err) {
      console.error(`YouTube fetch error: ${err.message}`);

      let errorMessage = "Failed to load videos. ";

      if (err.code === 'ECONNABORTED') {
        errorMessage += "Request timed out. Please check your internet connection.";
      } else if (!err.response) {
        errorMessage += "Network error. Unable to connect to the server. Please check your internet connection or try again later.";
      } else if (err.response.status === 400) {
        errorMessage += "Bad request. Invalid search parameters.";
      } else if (err.response.status === 401) {
        errorMessage += "Unauthorized. YouTube API key is invalid or missing.";
      } else if (err.response.status === 403) {
        errorMessage += "Access forbidden. YouTube API quota may be exceeded or access denied.";
      } else if (err.response.status === 404) {
        errorMessage += "YouTube API endpoint not found. Please contact support.";
      } else if (err.response.status === 429) {
        errorMessage += "Too many requests. YouTube API rate limit exceeded. Please try again later.";
      } else if (err.response.status === 500) {
        errorMessage += "Server error. Please try again later.";
      } else if (err.response.status === 502 || err.response.status === 503 || err.response.status === 504) {
        errorMessage += "Server temporarily unavailable. Please try again later.";
      } else {
        errorMessage += err.message || "An unexpected error occurred. Please try again later.";
      }

      // Retry logic for certain errors
      const shouldRetry = (
        retryAttempt < 3 &&
        (err.code === 'ECONNABORTED' || !err.response || err.response.status >= 500)
      );

      if (shouldRetry) {
        console.log(`Retrying in ${Math.pow(2, retryAttempt)} seconds...`);
        setIsRetrying(true);
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchVideos(token, query, retryAttempt + 1);
        }, Math.pow(2, retryAttempt) * 1000); // Exponential backoff
        return;
      }

      setError(errorMessage);
      setRetryCount(0);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [backendAvailable]);

  // Additional error message improvements for no videos or missing IDs
  useEffect(() => {
    if (error) {
      if (error.includes("No videos found")) {
        setError("No videos matched your search. Please try different keywords.");
      } else if (error.includes("Video missing ID")) {
        setError("Some videos returned by the server are missing IDs and cannot be displayed.");
      }
    }
  }, [error]);

  const handleSearch = () => {
    setVideos([]); // Clear previous videos
    setNextPageToken(null); // Reset pagination
    setError(""); // Clear any previous errors
    fetchVideos("", searchQuery); // Fetch videos with the search query
  };

  const handleRetry = () => {
    setError("");
    fetchVideos("", searchQuery);
  };

  useEffect(() => {
    // Check backend availability on mount
    const checkBackend = async () => {
      try {
        const res = await API.get('/api/youtube/videos', { timeout: 5000 });
        if (res.status === 200) {
          setBackendAvailable(true);
        } else {
          setBackendAvailable(false);
        }
    } catch {
      setBackendAvailable(false);
    }
    };
    checkBackend();
  }, []);

  useEffect(() => {
    if (backendAvailable === true) {
      fetchVideos(); // Initial fetch after backend check
    }
  }, [backendAvailable, fetchVideos]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        window.innerHeight + window.scrollY >=
          containerRef.current.scrollHeight - 200 &&
        nextPageToken &&
        !loading &&
        !isRetrying
      ) {
        fetchVideos(nextPageToken, searchQuery); // Load more videos
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loading, isRetrying, searchQuery, fetchVideos]);

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
          disabled={loading || isRetrying}
        />
        <button
          onClick={handleSearch}
          disabled={loading || isRetrying}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
          <button
            onClick={handleRetry}
            disabled={loading || isRetrying}
            className="retry-button"
          >
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>
        </div>
      )}

      {isRetrying && (
        <div className="retry-notice">
          <p>Retrying... (Attempt {retryCount + 1}/3)</p>
        </div>
      )}

      <div className="video-grid">
        {videos.length === 0 && !loading && !error && !isRetrying && (
          <p className="no-videos">No videos to display. Try searching for something!</p>
        )}

        {videos.map((video, idx) => (
          <div className="video-card" key={video.videoId || video.id || idx}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.videoId || video.id}`}
              title={video.title}
              frameBorder="0"
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="video-title">{video.title}</div>
            {video.description && (
              <div className="video-description">
                {video.description.length > 100
                  ? `${video.description.substring(0, 100)}...`
                  : video.description
                }
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && !isRetrying && (
        <div className="loading-container">
          <p>Loading videos...</p>
          <div className="loading-spinner"></div>
        </div>
      )}

      {loading && nextPageToken && (
        <p>Loading more videos...</p>
      )}
    </div>
  );
};

export default YouTubeFetcher;
