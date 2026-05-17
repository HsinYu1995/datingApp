import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { useProfiles } from "../context/ProfileContext";

export default function ProfileStack() {
  const { profiles } = useProfiles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState(null);

  const current = profiles[currentIndex];
  const next = profiles[currentIndex + 1];

  function handleSwipe(type) {
    setAction(type);
    setTimeout(() => {
      setAction(null);
      setCurrentIndex((i) => i + 1);
    }, 400);
  }

  if (profiles.length === 0) {
    return (
      <div className="empty-stack">
        <p>No profiles yet. Add some!</p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="empty-stack">
        <p>You've seen everyone!</p>
        <button className="btn btn-secondary" onClick={() => setCurrentIndex(0)}>
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="stack-area">
      <div className="card-counter">
        {currentIndex + 1} / {profiles.length}
      </div>

      <div className="card-stack">
        {next && (
          <div className="stack-card stack-card--behind">
            <ProfileCard profile={next} />
          </div>
        )}
        <div className={`stack-card stack-card--top ${action ? `swipe-${action}` : ""}`}>
          <ProfileCard profile={current} />
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn-action btn-action--pass"
          onClick={() => handleSwipe("left")}
          title="Pass"
        >
          ✕
        </button>
        <button
          className="btn-action btn-action--like"
          onClick={() => handleSwipe("right")}
          title="Like"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
