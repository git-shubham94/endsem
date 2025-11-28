// src/components/FeedbackForm.jsx

import { useState } from "react";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("Feedback submitted!\nName: " + name + "\nFeedback: " + feedback);
    setName("");
    setFeedback("");
  }

  return (
    <div style={{ width: "350px", margin: "20px auto" }}>
      <h2>Feedback Form</h2>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <label>Feedback / Suggestion:</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: "8px" }}
        />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "8px 15px",
            background: "black",
            color: "white",
            border: "none",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
