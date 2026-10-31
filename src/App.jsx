import SnakeGame from "./games/SnakeGame";
import { useState } from "react";
import "./index.css";
import WelcomePopup from "./components/WelcomePopup";
import DateTimeWidget from "./components/DateTimeWidget";


const projects = [
  {
    title: "FastAid AI",
    category: "AI / BACKEND",
    description: "An AI healthcare assistant project using Python, FastAPI and SQLite.",
    tech: "PYTHON · FASTAPI · SQLITE",
    symbol: "✚",
  },
  {
    title: "Python Game Lab",
    category: "SOFTWARE DEVELOPMENT",
    description: "Interactive Python games built to explore logic and programming.",
    tech: "PYTHON · PYGAME",
    symbol: "⌘",
  },
  {
    title: "Web Studio",
    category: "WEB DEVELOPMENT",
    description: "A collection of responsive interfaces built with modern web technologies.",
    tech: "HTML · CSS · JAVASCRIPT",
    symbol: "</>",
  },
];

function App() {
  const [gameLabOpen, setGameLabOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  return (
    
    <>
      <header className="navbar">
        <a className="logo" href="#home">PREM<span>FLIX</span></a>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="availability"><i /> OPEN TO OPPORTUNITIES</span>
      </header>

      <main>
        <WelcomePopup />
        <DateTimeWidget />

        <section className="hero" id="home">
          <div className="hero-art">
              <img src="Profile.png" alt="Premananda Saint" className = "profile-img" />

          </div>
          <div className="hero-content">
            <p className="eyebrow"><span /> DEVELOPER PORTFOLIO · 2026</p>
            <h1>
              PREM<span className="red">.</span><br />
              <span className="outline">BUILDING</span><br />
              THE FUTURE<span className="red">.</span>
            </h1>
            <p className="intro">
              Computer Science student passionate about Python,
              Artificial Intelligence and building useful digital experiences.
            </p>
            <div className="hero-buttons">
              <a className="button primary" href="#projects">▶ EXPLORE MY WORK</a>
              <a className="button secondary" href="resume.pdf" download={"Premananda_saint_Resume"}>
                MORE ABOUT ME ↗
              </a>
            </div>
            <p className="hero-meta">BASED IN INDIA 🇮🇳　·　AI　·　SOFTWARE　·　WEB</p>
          </div>
          <span className="side-label">CREATIVE MIND / TECH BUILDER</span>
        </section>

        <div className="ticker">
          PYTHON　✳　ARTIFICIAL INTELLIGENCE　✳　REACT　✳　FASTAPI　✳　PROBLEM SOLVING　✳
        </div>

        <section className="section" id="about">
          <p className="eyebrow">01 / THE DEVELOPER</p>
          <h2>CURIOUS BY NATURE.<br />BUILT TO <span className="red">CREATE.</span></h2>
          <div className="about-grid">
            <div className="about-photo"><img src="/coding_time_photo.png" alt="Coding at my desk"/><span className="photo-label">THE DEVELOPER</span></div>
            <div>
              <h3>Hey, I'm Prem.</h3>
              <p className="muted">
                I'm a Computer Science student exploring the intersection of
                software engineering and artificial intelligence.
              </p>
              <p className="muted">
                I enjoy creating Python applications, experimenting with AI/ML,
                developing APIs and turning ideas into working projects.
              </p>
              <div className="stats">
                <div><strong>B.TECH</strong><small>COMPUTER SCIENCE</small></div>
                <div><strong>AI + WEB</strong><small>AREAS OF INTEREST</small></div>
                <div><strong>BUILD</strong><small>LEARN · IMPROVE</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section projects" id="projects">
          <p className="eyebrow">02 / SELECTED WORKS</p>
          <h2>MY PROJECTS<span className="red">.</span></h2>
          <p className="muted">A growing collection of ideas, experiments and things I've built.</p>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                <div className={`project-art art-${index}`}>
                  <span className="project-number">0{index + 1}</span>
                  <span className="project-symbol">{project.symbol}</span>
                  <span className="art-title">{project.title}</span>
                </div>
                <div className="project-details">
                  <p className="eyebrow">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="muted">{project.description}</p>
                  <p className="tech">{project.tech}</p>
                  {project.title === "Python Game Lab" ? (
                    <button type="button" className="project-link game-banner-button" onClick={() => { setGameLabOpen(true); setSelectedGame(null); }} >
                      PLAY GAMES →
                      </button>
                    ) : (
                    <a
                      className="project-link"
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GITHUB PROFILE ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="small-note">Sample project cards — add your real repository links before publishing.</p>
        </section>

            {gameLabOpen && (
        <section className="section game-lab-screen" id="game-lab">
         <button
            type="button"
            className="button secondary"
            onClick={() => {
              if (selectedGame) {
                setSelectedGame(null);
              } else {
                setGameLabOpen(false);
              }
            }}
          >
            ← {selectedGame ? "BACK TO GAMES" : "CLOSE GAME LAB"}
          </button>

          {!selectedGame ? (
            <>
              <p className="eyebrow">PYTHON GAME LAB / 01</p>
             <h2>
                SELECT YOUR GAME<span className="red">.</span>
              </h2>
              <p className="muted">
                Choose a game, test your skills and have fun.
              </p>

              <div className="game-grid">
                <article className="project-card">
                  <div className="project-art">
                    <span className="project-symbol">🐍</span>
                    <span className="art-title">SNAKE GAME</span>
                  </div>
                  <div className="project-details">
                    <h3>Snake Game</h3>
                    <p className="muted">
                      Eat food, grow your snake and beat your high score.
                    </p>
                      <button type="button" className="button primary" onClick={() => setSelectedGame("snake")} >
                       PLAY SNAKE →
                      </button>
                    </div>
                  </article>

                  <article className="project-card">
                    <div className="project-art">
                      <span className="project-symbol">✕ ○</span>
                      <span className="art-title">TIC-TAC-TOE</span>
                  </div>
                  <div className="project-details">
                    <h3>Tic-Tac-Toe</h3>
                    <p className="muted">
                      Challenge a friend in the classic X and O game.
                    </p>
                    <button
                      type="button"
                      className="button primary"
                      onClick={() => setSelectedGame("tic-tac-toe")}
                    >
                    PLAY TIC-TAC-TOE →
                    </button>
                  </div>
                </article>
              </div>
            </>
          ) : selectedGame === "snake" ? (
            <div style={{ color: "white", padding: "20px" }}>
  SNAKE COMPONENT TEST — IT WORKS!
</div>
          ) : (
            <div className="game-placeholder">
              <p className="eyebrow">GAME SELECTED</p>
              <h2>
                TIC-TAC-TOE<span className="red">.</span>
              </h2>
              <p className="muted">
                We'll add the playable Tic-Tac-Toe game next.
              </p>
            </div>
          )}

        </section>
    )}

        <section className="section" id="skills">
          <p className="eyebrow">03 / MY TOOLKIT</p>
          <h2>TOOLS OF THE TRADE<span className="red">.</span></h2>
          <div className="skills-grid">
            {[
              ["01", "Python", "Programming"],
              ["02", "AI  (GEN AI , AI AGENT) / Machine Learning (NLP)", "Artificial Intelligence"],
              ["03", "React", "Frontend"],
              ["04", "FastAPI", "Backend"],
              ["05", "SQL / SQLite", "Databases"],
              ["06", "HTML / CSS / JS", "Web Development"],
            ].map(([number, name, category]) => (
              <div className="skill" key={number}>
                <span className="red">{number}</span>
                <div><h3>{name}</h3><small>{category}</small></div>
                <span className="skill-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        
        <section className="contact" id="contact">
          <p className="eyebrow">04 / YOUR NEXT COLLABORATOR?</p>

          <h2>
            LET'S BUILD<br />
            SOMETHING <span className="red">REAL.</span>
          </h2>

          <p className="muted">
            Have an opportunity, an idea, or an interesting problem?
          </p>

          <div className="contact-dropdown">
            <button
              type="button"
              className="button primary contact-trigger"
            >
              GET IN TOUCH <span>↗</span>
            </button>

            <div className="contact-options">
              <a
                href="mailto:premananda99@gmail.com"
                className="contact-option"
              >
                <img src="/email.png" alt="Email" className="contact-image" />
                <span className="contact-text">
                  <strong>Email Me</strong>
                  <small>Send me an email</small>
                </span>
                <span className="contact-arrow">↗</span>
              </a>

              <a
                href="tel:+919040223585"
                className="contact-option"
              >
                <img src="/phone.png" alt="Phone" className="contact-image" />
                <span className="contact-text">
                  <strong>Call Me</strong>
                  <small>Let's talk directly</small>
                </span>
                <span className="contact-arrow">↗</span>
              </a>
            </div>
          </div>

          <div className="socials">
            <a href="https://github.com/Prem-code07" target="_blank" rel="noreferrer">
              <img src="/Github.png" alt="GitHub" />
            </a>
            <a
              href="https://www.linkedin.com/in/premananda-saint-5b58b9405"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/linkedin.png" alt="LinkedIn" />
            </a>
            <a
              href="https://youtube.com/@premsworldvlog?si=LRHav29IGqSfxyaf"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/youtube.png" alt="YouTube" />
            </a>

            <a
              href="https://www.instagram.com/premananda._saint?rpxt=MXZpbGdzYnE4bGI0"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/instagram.png" alt="Instagram" />
            </a>
          </div>
        </section>

      
        {gameLabOpen && (
          <div
            className="game-modal-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setGameLabOpen(false);
                setSelectedGame(null);
              }
            }}
          >
            <div
              className="game-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="game-modal-title"
            >
              <button
                className="game-modal-close"
                type="button"
                onClick={() => {
                  setGameLabOpen(false);
                  setSelectedGame(null);
                }}
                aria-label="Close Game Lab"
              >
                ×
              </button>

              {!selectedGame ? (
                <>
                  <p className="eyebrow">PREMFLIX / GAME LAB</p>
                  <h2 id="game-modal-title">
                    CHOOSE YOUR GAME<span className="red">.</span>
                  </h2>
                  <p className="muted">Select a game to start playing.</p>

                  <button
                    className="game-option"
                    type="button"
                    onClick={() => setSelectedGame("snake")}
                  >
                    <span className="game-option-icon">🐍</span>
                    <span>
                      <strong>Snake Game</strong>
                      <small>Eat food. Grow longer. Beat your score.</small>
                    </span>
                    <span className="game-option-arrow">→</span>
                  </button>

                  <button
                    className="game-option"
                    type="button"
                    onClick={() => setSelectedGame("tic-tac-toe")}
                  >
                    <span className="game-option-icon">✕ ○</span>
                    <span>
                      <strong>Tic-Tac-Toe</strong>
                      <small>Challenge yourself or a friend.</small>
                    </span>
                    <span className="game-option-arrow">→</span>
                  </button>
                </>
             

          ) : (
            <>
              <button
                type="button"
                className="game-back"
                onClick={() => setSelectedGame(null)}
              >
                ← ALL GAMES
              </button>

              {selectedGame === "snake" ? (
                <SnakeGame />
              ) : (
                <>
                  <p className="eyebrow">NOW PLAYING</p>
                  <h2>
                    TIC-TAC-TOE<span className="red">.</span>
                  </h2>
                  <p className="muted">
                    The Tic-Tac-Toe game will be added next.
                  </p>
                </>
              )}
            </>
          )}


            </div>
          </div>
        )}


      </main>

      <footer>
        <a className="logo" href="#home">PREM<span>FLIX</span></a>
        <small>DESIGNED WITH PURPOSE. BUILT WITH CODE.</small>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </>
  );
}

export default App;
