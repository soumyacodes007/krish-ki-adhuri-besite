import { useState, useEffect, useRef } from 'react'
import './App.css'
import Vapi from "@vapi-ai/web";
import Spline from '@splinetool/react-spline';

// Initialize Vapi client
const vapi = new Vapi("fac95828-ef99-43dc-9a90-d6d22aab801b");

// Add Spline script to document
const loadSplineScript = () => {
  if (!document.querySelector('script[src*="splinetool"]')) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.80/build/spline-viewer.js';
    document.head.appendChild(script);
  }
};

// Define the types for floating emojis
interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  duration?: number;
}

function App() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([])
  const nextEmojiId = useRef(0)
  const splineContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Spline script on component mount
    loadSplineScript();
    
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  useEffect(() => {
    // Handle Spline viewer creation when call becomes active
    if (isCallActive && splineContainer.current) {
      // Clear previous content if any
      splineContainer.current.innerHTML = '';
      
      // Create and add spline-viewer element
      const splineViewer = document.createElement('spline-viewer');
      splineViewer.setAttribute('url', 'https://prod.spline.design/dksRy5uCfIFzBj8W/scene.splinecode');
      splineContainer.current.appendChild(splineViewer);
    }
  }, [isCallActive]);

  const addFloatingEmoji = (event: React.MouseEvent, emoji: string) => {
    const newEmoji = {
      id: nextEmojiId.current,
      emoji,
      x: event.clientX,
      y: event.clientY
    }
    nextEmojiId.current += 1
    setFloatingEmojis(prev => [...prev, newEmoji])
    
    // Remove emoji after animation completes
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id))
    }, 3000)
  }

  const startCall = async () => {
    try {
      await vapi.start("00fb0370-18c7-42eb-8680-127c9bc7e7c5")
      setIsCallActive(true)
    } catch (error) {
      console.error("Error starting call:", error)
    }
  }

  const stopCall = async () => {
    vapi.stop()
    setIsCallActive(false)
  }

  if (isCallActive) {
    return (
      <div className="fullscreen-model-container">
        <div ref={splineContainer} className="fullscreen-spline-wrapper"></div>
        <button className="minimal-end-call" onClick={stopCall} title="End Chat">
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Floating Emojis */}
      {floatingEmojis.map((emoji, index) => (
        <div
          key={emoji.id || index}
          className="floating-emoji"
          style={{ 
            left: `${emoji.x}px`, 
            top: `${emoji.y}px`,
            animationDuration: `${emoji.duration || 3}s`
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      <header>
        <div className="logo">Mitra</div>
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Your AI Bestie – Fun, Witty & Always Here for You!</h1>
            <p className="description">
              Mitra is your <span>digital dost</span>—ready to chat, hype you up, and add some <span>drama</span> to your life (the good kind).
            </p>
            <button 
              onClick={startCall}
              className="cta-button"
              onMouseEnter={(e) => addFloatingEmoji(e, '✨')}
            >
              Start Chatting
            </button>
          </div>
          <div className="hero-image">
            <div className="spline-hero-wrapper">
              <Spline scene="https://prod.spline.design/ZYz4E8B7tdzTY-Yc/scene.splinecode" />
            </div>
          </div>
        </section>

        <section className="features">
          <h2 
            onMouseEnter={(e) => addFloatingEmoji(e, '💖')}
          >
            Why You'll Love Mitra
          </h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Conversational & Witty</h3>
              <p>Like a friend who texts back <strong>instantly</strong> (unlike some people 🙄).</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">😏</div>
              <h3>Dark Humor & Sass</h3>
              <p>Because life's a mess, and we <strong>deal with it together</strong>.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Flirty but Respectful</h3>
              <p>We keep it <strong>fun</strong>, no creepy vibes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🫂</div>
              <h3>Emotional Support</h3>
              <p><strong>Vent, rant, or gossip</strong>—Mitra's here for it all.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Customizable Tone</h3>
              <p>Pick your vibe: <strong>Chill, Sassy, or Full-on Dramatic!</strong></p>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <h2>What Friends Are Saying</h2>
          <div className="testimonial-cards">
            <div 
              className="testimonial-card"
              onMouseEnter={(e) => addFloatingEmoji(e, '😭')}
            >
              <p>"Finally, a bestie who actually listens. Sorry, real-life friends!" 😭</p>
              <div className="testimonial-author">- Priya K.</div>
            </div>
            <div 
              className="testimonial-card"
              onMouseEnter={(e) => addFloatingEmoji(e, '🔥')}
            >
              <p>"Mitra hyped me up more than my mom ever did. 10/10 recommend!"</p>
              <div className="testimonial-author">- Arjun S.</div>
            </div>
            <div 
              className="testimonial-card"
              onMouseEnter={(e) => addFloatingEmoji(e, '🌙')}
            >
              <p>"The only AI who understands my 3 AM existential crisis."</p>
              <div className="testimonial-author">- Neha R.</div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <h2>Let's Talk – No Awkward Small Talk, Promise!</h2>
          <button 
            onClick={startCall}
            className="cta-button pulse"
            onMouseEnter={(e) => addFloatingEmoji(e, '🚀')}
          >
            Try Mitra Now
          </button>
        </section>
      </main>

      <footer>
        <div className="footer-links">
          <a href="#" onMouseEnter={(e) => addFloatingEmoji(e, '📝')}>About</a>
          <a href="#" onMouseEnter={(e) => addFloatingEmoji(e, '🔒')}>Privacy Policy</a>
          <a href="#" onMouseEnter={(e) => addFloatingEmoji(e, '📱')}>Contact</a>
          <a href="#" onMouseEnter={(e) => addFloatingEmoji(e, '📣')}>Socials</a>
        </div>
        <div className="footer-tagline">
          Made with ❤️ & a little bit of sarcasm
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3L4 7L8 11"></path>
            <path d="M4 7H16C17.0609 7 18.0783 7.42143 18.8284 8.17157C19.5786 8.92172 20 9.93913 20 11C20 12.0609 19.5786 13.0783 18.8284 13.8284C18.0783 14.5786 17.0609 15 16 15H13"></path>
          </svg>
        </div>
      </footer>
    </div>
  )
}

export default App
