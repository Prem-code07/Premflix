
import { useState } from "react";

export default function WelcomePopup() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="welcome-overlay">
      <div className="welcome-popup">
        <button
          className="welcome-close"
          onClick={() => setShow(false)}
          aria-label="Close welcome popup"
        >
          ×
        </button>

        <div className="robot-stage">
          <video
            className="welcome-robot-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="/Robot_neon_video.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="welcome-content">
          <p className="welcome-label">
            PREMFLIX ASSISTANT
          </p>

          <h2>Hii dear! 👋</h2>
          <h3>What's up?</h3>

          <p>
            Welcome to my portfolio!
            <br />
            I'm happy you're here. 😊
          </p>

          <button
            className="welcome-button"
            onClick={() => {
              setShow(false);
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            LET'S GO ↗
          </button>
        </div>
      </div>
    </div>
  );
}
