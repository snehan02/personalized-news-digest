import { useState, useEffect } from "react";
import API from "../api";

export default function Topics() {
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);

  const loadTopics = async () => {
    const res = await API.get("/topics");
    setTopics(res.data.topics);
  };

  const addTopic = async () => {
    await API.post("/topics/add", { topic });
    setTopic("");
    loadTopics();
  };

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Topics</h2>
      <input className="border p-2 mr-2" value={topic} onChange={e => setTopic(e.target.value)} />
      <button className="bg-purple-600 text-white px-3 py-2" onClick={addTopic}>Add</button>
      <ul className="mt-4">
        {topics.map(t => <li key={t}>• {t}</li>)}
      </ul>
    </div>
  );
}
