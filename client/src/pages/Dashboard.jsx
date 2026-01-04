import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/dashboard.css";

export default function Dashboard({ onLogout }) {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [news, setNews] = useState([]);
  const [subscribed, setSubscribed] = useState(true);

  /* ---------- DARK MODE ---------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    fetchTopics();
    fetchNews();
  }, []);

  const fetchTopics = async () => {
    const res = await API.get("/topics");
    setTopics(res.data.topics || []);
  };

  const fetchNews = async () => {
    try {
      const res = await API.get("/news/common");
      setNews(res.data.articles || []);
    } catch (err) {
      console.error("Failed to fetch news", err);
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
    if (!subscribed) {
      alert("Please subscribe to receive the digest");
      return;
    }

    await API.post("/digest/send");
    alert("Digest sent!");
  };

  const toggleSubscription = async () => {
    try {
      const res = await API.post("/subscription/toggle");
      setSubscribed(res.data.subscribed);
    } catch (err) {
      console.error("Failed to toggle subscription", err);
    }
  };

  /* ---------- GREETING ---------- */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌅";
    if (hour < 17) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dash-header">
        <div className="header-right">
          <h1 className="dashboard-title">News Dashboard</h1>
          <p className="greeting-text">{getGreeting()}</p>
        </div>

        <div className="header-actions">
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button className="sub-btn" onClick={toggleSubscription}>
            {subscribed ? "🔕 Unsubscribe" : "🔔 Subscribe"}
          </button>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
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

              {n.url && (
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more-link"
                >
                  Read More →
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
