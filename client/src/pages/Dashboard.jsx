import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/dashboard.css";

export default function Dashboard({ onLogout }) {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchTopics();
    fetchNews();
  }, []);

  /* ---------- TOPICS ---------- */
  const fetchTopics = async () => {
    const res = await API.get("/topics");
    setTopics(res.data.topics || []);
  };

  /* ---------- ✅ FIXED NEWS FETCH ---------- */
  const fetchNews = async () => {
    try {
      const res = await API.get("/news/common");

      // Safely normalize backend response
      let newsArray = [];

      if (Array.isArray(res.data)) {
        newsArray = res.data;
      } else if (Array.isArray(res.data?.articles)) {
        newsArray = res.data.articles;
      } else if (Array.isArray(res.data?.news)) {
        newsArray = res.data.news;
      }

      setNews(newsArray);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    }
  };

  /* ---------- ACTIONS ---------- */
  const addTopic = async () => {
    if (!newTopic.trim()) return;
    await API.post("/topics/add", { topic: newTopic });
    setNewTopic("");
    fetchTopics();
  };

  const removeTopic = async (topic) => {
    await API.post("/topics/remove", { topic });
    fetchTopics();
  };

  const sendDigest = async () => {
    await API.post("/digest/send");
    alert("Digest sent!");
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dash-header">
        <h1>News Dashboard</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      {/* TOPICS */}
      <section className="card">
        <h3>Your Topics</h3>

        <div className="topic-row">
          <input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Enter topic"
          />
          <button onClick={addTopic}>Add</button>
        </div>

        <div className="topic-chips">
          {topics.map((t) => (
            <span key={t}>
              {t}
              <button onClick={() => removeTopic(t)}>×</button>
            </span>
          ))}
        </div>

        <button className="digest-btn" onClick={sendDigest}>
          📩 Send Digest
        </button>
      </section>

      {/* NEWS */}
      <section className="card">
        <h3>Latest News</h3>

        {news.length === 0 && <p>No news available</p>}

        {news.map((n, i) => (
          <div key={i} className="news-item">
            <img
              src={n.urlToImage || "https://via.placeholder.com/80"}
              alt="news"
            />
            <div>
              <h4>{n.title}</h4>
              <p>By {n.author || "News Source"}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
