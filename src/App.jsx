import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './index.css';
import { WavyBackground } from './components/wavy-background';
import MarqueeDefault from 'react-fast-marquee';
import TiltDefault from 'react-parallax-tilt';
import heroImg from './assets/hero.png';

const Marquee = MarqueeDefault.default || MarqueeDefault;
const Tilt = TiltDefault.default || TiltDefault;

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

const Typewriter = ({ words, delay = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, 100);
    }

    if (!isDeleting && currentText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, delay]);

  return <span>{currentText}</span>;
};

const FadeIn = ({ children, delay = 0, className = '', style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

const TiltCard = ({ children, delay = 0, className = '', style = {} }) => (
  <FadeIn delay={delay} style={{ display: 'flex', width: '100%', height: '100%' }}>
    <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable={true} glareMaxOpacity={0.05} glareColor="var(--primary-blue)" glarePosition="all" style={{ width: '100%', display: 'flex' }}>
      <div className={`minimal-card ${className}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', ...style }}>
        {children}
      </div>
    </Tilt>
  </FadeIn>
);

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [githubData, setGithubData] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Sending...');
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSubmitStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('Failed to send. Is the backend running?');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/ayushman3004');
        setGithubData(response.data);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        // Fallback data if GitHub API rate limit is exceeded
        setGithubData({
          public_repos: "25+",
          followers: "5+",
          following: "7+",
          html_url: "https://github.com/ayushman3004"
        });
      }
    };
    fetchGithubData();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <CustomCursor />
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <a href="#" className="logo" onClick={closeMenu}>AB</a>
          <div className="nav-links">
            <a href="#about" className="nav-link">About</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#education" className="nav-link">Education</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
          <a href="#about" className="mobile-link" onClick={closeMenu}>About</a>
          <a href="#skills" className="mobile-link" onClick={closeMenu}>Skills</a>
          <a href="#projects" className="mobile-link" onClick={closeMenu}>Projects</a>
          <a href="#experience" className="mobile-link" onClick={closeMenu}>Experience</a>
          <a href="#education" className="mobile-link" onClick={closeMenu}>Education</a>
          <a href="#contact" className="mobile-link" onClick={closeMenu}>Contact</a>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="section section-light" style={{ padding: 0 }}>
          <WavyBackground
            backgroundFill="var(--bg-white)"
            waveOpacity={0.6}
            colors={["#1C76FF", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]}
          >
            <div className="container hero" style={{ paddingTop: '8rem', paddingBottom: '4rem', zIndex: 10 }}>
              <div className="hero-content">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                  className="hero-title"
                >
                  AYUSHMAN<br /><span className="gradient-text">BHATTACHARYA</span>
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
                  className="hero-subtitle"
                >
                  <Typewriter words={["Full Stack Developer", "AI Enthusiast", "Problem Solver"]} />
                  <span className="cursor">|</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                  className="hero-desc"
                >
                  Passionate about building scalable web applications and AI-driven solutions with modern, minimal design principles.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }}
                  className="hero-cta"
                >
                  <a href="#projects" className="btn btn-primary">View Projects</a>
                  <a href="/AyushmanCV.docx" download className="btn btn-outline"><i className="fas fa-download"></i> Resume</a>
                  <a href="#contact" className="btn btn-outline">Contact Me</a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}
                  className="social-links"
                >
                  <a href="https://github.com/ayushman3004" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                  <a href="https://www.linkedin.com/in/ayushman30" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
                  <a href="mailto:ayushman.rick007@gmail.com"><i className="fas fa-envelope"></i></a>
                </motion.div>
              </div>
              
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} glarePosition="all" style={{ zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  style={{ position: 'relative', width: '100%', padding: '2rem' }}
                >
                  <div style={{ position: 'absolute', inset: '10%', background: 'var(--primary-blue)', filter: 'blur(80px)', opacity: 0.4, zIndex: -1, borderRadius: '50%' }}></div>
                  <img src="https://img.freepik.com/premium-vector/illustration-web-development-programmer-coding-website_746655-2851.jpg?semt=ais_hybrid&w=740&q=80" alt="Ayushman Bhattacharya" style={{ width: '100%', maxWidth: '450px', height: 'auto', display: 'block', margin: '0 auto', objectFit: 'cover', borderRadius: '40px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.25)' }} />
                </motion.div>
              </Tilt>
            </div>
          </WavyBackground>
        </section>

        {/* Marquee Divider */}
        <div style={{ background: 'var(--primary-blue)', color: 'var(--bg-white)', padding: '1.5rem 0', transform: 'rotate(-2deg)', margin: '4rem -2rem', width: 'calc(100% + 4rem)', overflow: 'hidden' }}>
          <Marquee speed={80} gradient={false}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Building The Future</span> •
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Scalable Modern Web</span> •
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>AI-Driven Applications</span> •
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Full Stack Expertise</span> •
            <span style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Creative Interfaces</span> •
          </Marquee>
        </div>

        {/* About Section */}
        <section id="about" className="section section-light">
          <div className="container">
            <FadeIn><h2 className="section-title">ABOUT <span className="gradient-text">ME</span></h2></FadeIn>
            <div className="about-grid">
              <TiltCard delay={0.1} className="about-card">
                <div className="about-icon"><i className="fas fa-user-graduate"></i></div>
                <h3>B.Tech CSE Student</h3>
                <p>Lovely Professional University</p>
                <p className="highlight" style={{ marginTop: '0.5rem' }}>CGPA: 7.53</p>
              </TiltCard>
              <TiltCard delay={0.2} className="about-card">
                <div className="about-icon"><i className="fas fa-laptop-code"></i></div>
                <h3>Passionate Developer</h3>
                <p>Strong interest in full-stack development and AI-based applications. Driven by a problem-solving mindset and continuous learning.</p>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section section-dark">
          <div className="container">
            <FadeIn><h2 className="section-title">MY <span className="gradient-text">SKILLS</span></h2></FadeIn>
            <div className="skills-grid">
              <TiltCard delay={0.1} className="skill-category">
                <h3><i className="fas fa-code"></i> Languages</h3>
                <div className="skill-tags">
                  <span>JavaScript</span><span>Python</span><span>C++</span><span>Java</span>
                </div>
              </TiltCard>
              <TiltCard delay={0.2} className="skill-category">
                <h3><i className="fas fa-layer-group"></i> Frameworks</h3>
                <div className="skill-tags">
                  <span>ReactJs</span><span>NextJs</span><span>NodeJs</span><span>ExpressJs</span><span>Mongoose</span>
                </div>
              </TiltCard>
              <TiltCard delay={0.3} className="skill-category">
                <h3><i className="fas fa-database"></i> Tools</h3>
                <div className="skill-tags">
                  <span>MongoDB</span><span>MySQL</span><span>Postman</span><span>Git</span><span>Vercel</span>
                </div>
              </TiltCard>
              <TiltCard delay={0.4} className="skill-category">
                <h3><i className="fas fa-users"></i> Soft Skills</h3>
                <div className="skill-tags">
                  <span>Problem-solving</span><span>Team Leader</span><span>Adaptability</span>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section section-light">
          <div className="container">
            <FadeIn><h2 className="section-title">FEATURED <span className="gradient-text">PROJECTS</span></h2></FadeIn>
            <div className="projects-grid">
              <TiltCard delay={0.1} className="project-card">
                <div className="project-tags">
                  <span>NextJs</span><span>TypeScript</span><span>OpenAI</span><span>Tailwind</span>
                </div>
                <h3>Random Anonymous Feedback Generator</h3>
                <p>Built an AI-driven web app linking OpenAI and Google AI SDKs to summarize, classify, and interpret user feedback. Secured the UI with Radix UI, React Hook Form, and Zod while ensuring performance via Turbopack and React Email verification.</p>
                <div className="project-links">
                  <a href="https://github.com/ayushman3004/Feedback_generator" className="btn btn-outline btn-sm"><i className="fab fa-github"></i> GitHub</a>
                </div>
              </TiltCard>
              <TiltCard delay={0.2} className="project-card">
                <div className="project-tags">
                  <span>PHP</span><span>MySQL</span><span>OpenCV</span><span>PyTorch</span>
                </div>
                <h3>Water Monitoring System</h3>
                <p>Developed an AI-powered portal for analyzing water pollution with manual inputs and image detection. The full-stack pipeline integrates OpenCV–PyTorch to run feature extraction, providing automated comparative insights in real time.</p>
                <div className="project-links">
                  <a href="https://github.com/ayushman3004/Water_Monitoring_System" className="btn btn-outline btn-sm"><i className="fab fa-github"></i> GitHub</a>
                  <a href="https://www.waterwatch.consulting" className="btn btn-primary btn-sm"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section section-dark">
          <div className="container">
            <FadeIn><h2 className="section-title">INTERNSHIP & <span className="gradient-text">EXPERIENCE</span></h2></FadeIn>
            <div className="timeline">
              <FadeIn delay={0.1} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">Past</span>
                  <h3>Frontend Developer Intern</h3>
                  <h4 className="gradient-text">Kirijo (www.kirijo.com)</h4>
                  <ul>
                    <li>Developed modular frontend components using React, improving performance through lazy loading.</li>
                    <li>Collaborated remotely with backend and design teams to integrate APIs, handle asynchronous data, and ensure smooth UX.</li>
                    <li>Enhanced user experience by optimizing routing and reducing bundle size.</li>
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Achievements & Certifications */}
        <section id="achievements" className="section section-light">
          <div className="container">
            <div className="dual-grid">
              <FadeIn delay={0.1}>
                <h2 className="section-title" style={{ textAlign: 'left' }}><span className="gradient-text">CERTIFICATIONS</span></h2>
                <ul className="fancy-list">
                  <li><i className="fas fa-award"></i><div><strong>MongoDB Certified Developer Associate</strong><span>MongoDB (Mar '26)</span></div></li>
                  <li><i className="fas fa-award"></i><div><strong>Mobile App Development using Flutter</strong><span>CipherSchools (Jun '25)</span></div></li>
                  <li><i className="fas fa-award"></i><div><strong>Privacy and Security in social media</strong><span>NPTEL (Jan '25)</span></div></li>
                  <li><i className="fas fa-award"></i><div><strong>Problem Solving Skills</strong><span>Hacker Rank (Nov '23)</span></div></li>
                </ul>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="section-title" style={{ textAlign: 'left' }}><span className="gradient-text">ACHIEVEMENTS</span></h2>
                <div className="stats-grid">
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1} glareColor="var(--primary-blue)" style={{ height: '100%' }}>
                    <div className="minimal-card stat-card" style={{ height: '100%' }}>
                      <div className="stat-number">400+</div>
                      <div className="stat-label">Coding Problems Solved</div>
                    </div>
                  </Tilt>
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1} glareColor="var(--primary-blue)" style={{ height: '100%' }}>
                    <div className="minimal-card stat-card" style={{ height: '100%' }}>
                      <div className="stat-number"><i className="fas fa-star" style={{fontSize:'2.5rem', verticalAlign:'middle', marginRight:'5px'}}></i>5</div>
                      <div className="stat-label">C++ (HackerRank)</div>
                    </div>
                  </Tilt>
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1} glareColor="var(--primary-blue)" style={{ gridColumn: '1 / -1', height: '100%' }}>
                    <div className="minimal-card stat-card" style={{ height: '100%' }}>
                      <div className="stat-number"><i className="fas fa-star" style={{fontSize:'2.5rem', verticalAlign:'middle', marginRight:'5px'}}></i>4</div>
                      <div className="stat-label">Python (HackerRank)</div>
                    </div>
                  </Tilt>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Education & Github stats */}
        <section id="education" className="section section-dark">
          <div className="container">
            <FadeIn><h2 className="section-title">EDUCATION & <span className="gradient-text">PROFILES</span></h2></FadeIn>
            <div className="dual-grid">
              <div className="timeline">
                <FadeIn delay={0.1} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">2023 - Present</span>
                    <h3>B.Tech Computer Science Engineering</h3>
                    <p style={{color: 'var(--text-light)', opacity: 0.8}}>Lovely Professional University &bull; Punjab, India</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.2} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">Apr 2021 - Mar 2022</span>
                    <h3>Higher Secondary</h3>
                    <p className="highlight">Score: 85%</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.3} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">Apr 2019 - Mar 2020</span>
                    <h3>Matriculation</h3>
                    <p className="highlight">Score: 91%</p>
                  </div>
                </FadeIn>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <TiltCard delay={0.3} className="comp-card">
                  <h3><i className="fas fa-trophy"></i> Competitive Programming</h3>
                  <p>Active participant in competitive programming platforms, continuously refining problem-solving skills and algorithmic thinking.</p>
                  <div className="cp-links">
                    <a href="https://codolio.com/profile/AyushMan" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">Codolio</a>
                    <a href="https://leetcode.com/u/__Ayush__30__/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">LeetCode</a>
                  </div>
                </TiltCard>

                <TiltCard delay={0.4} className="comp-card">
                  <h3><i className="fab fa-github"></i> GitHub Overview</h3>
                  {githubData ? (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Public Repos</span>
                        <strong style={{ color: 'var(--primary-blue)' }}>{githubData.public_repos}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>Followers</span>
                        <strong style={{ color: 'var(--primary-blue)' }}>{githubData.followers}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-light)' }}>Following</span>
                        <strong style={{ color: 'var(--primary-blue)' }}>{githubData.following}</strong>
                      </div>
                      <div className="cp-links" style={{ marginTop: '0.5rem' }}>
                        <a href={githubData.html_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>Visit GitHub</a>
                      </div>
                    </div>
                  ) : (
                    <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading stats...</p>
                  )}
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section section-light">
          <div className="container">
            <FadeIn><h2 className="section-title">GET IN <span className="gradient-text">TOUCH</span></h2></FadeIn>
            <div className="contact-container">
              <FadeIn delay={0.1} className="minimal-card contact-info" style={{background: 'transparent', border: 'none', padding: 0}}>
                <h3>Let's start a project together</h3>
                <p>Feel free to reach out for collaborations or just a friendly hello. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                <div className="contact-methods">
                  <a href="mailto:ayushman.rick007@gmail.com" className="contact-method">
                    <div className="cm-icon"><i className="fas fa-envelope"></i></div>
                    <div>
                      <h4>Email</h4>
                      <span>ayushman.rick007@gmail.com</span>
                    </div>
                  </a>
                  <a href="tel:+918167394620" className="contact-method">
                    <div className="cm-icon"><i className="fas fa-phone"></i></div>
                    <div>
                      <h4>Phone</h4>
                      <span>+91-8167394620</span>
                    </div>
                  </a>
                </div>
              </FadeIn>
              <TiltCard delay={0.2} className="contact-form-container">
                <form className="contact-form" onSubmit={handleSubmit}>
                  {submitStatus && <p style={{ color: submitStatus.includes('success') ? '#1C76FF' : '#f87171', marginBottom: '1rem', fontWeight: '600' }}>{submitStatus}</p>}
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="YOUR NAME" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="YOUR EMAIL" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="5" placeholder="HOW CAN I HELP YOU?" value={formData.message} onChange={handleChange} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Send Message</button>
                </form>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Footer Marquee */}
        <div style={{ background: 'var(--text-dark)', color: 'var(--primary-blue)', padding: '1rem 0', width: '100%', overflow: 'hidden', borderTop: '1px solid var(--border-dark)' }}>
          <Marquee speed={60} gradient={false} direction="right">
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Available For Freelance</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Let's Build Something Amazing</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Open To Opportunities</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Creative Problem Solving</span> ∾
            <span style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 2rem', textTransform: 'uppercase' }}>Always Learning</span> ∾
          </Marquee>
        </div>
      </main>

      <footer>
        <div className="container footer-content">
          <p>&copy; {new Date().getFullYear()} Ayushman Bhattacharya. All rights reserved.</p>
          <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://github.com/ayushman3004" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/ayushman30" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;

