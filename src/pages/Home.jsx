import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css"; // custom style file
import "animate.css";

function Home() {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/portfolio")
      .then((res) => setPortfolio(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!portfolio) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section text-white text-center py-5">
        <h1 className="display-4 animate__animated animate__fadeInDown">
          {portfolio.name}
        </h1>
        <p className="lead animate__animated animate__fadeInUp animate__delay-1s">
          {portfolio.title}
        </p>
      </header>

      <div className="container my-5">
        {/* About */}
        <section id="about" className="mb-5 section-animate">
          <h2 className="section-title">About Me</h2>
          <p className="section-text">{portfolio.about}</p>
        </section>

        {/* Skills */}
        <section id="skills" className="mb-5 section-animate">
          <h2 className="section-title">Skills</h2>
          <div className="d-flex flex-wrap gap-2">
            {portfolio.skills?.map((skill, i) => (
              <span key={i} className="badge skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-5 section-animate">
          <h2 className="section-title">Projects</h2>
          <div className="row">
            {portfolio.projects?.map((project, i) => (
              <div key={i} className="col-md-6 mb-4">
                <div className="card project-card shadow-lg border-0 animate__animated animate__fadeInUp">
                  <div className="card-body">
                    <h5 className="card-title ">{project.title}</h5>
                    <p className="card-text ">{project.description}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between bg-transparent border-0">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      GitHub
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-5 section-animate">
          <h2 className="section-title">Contact</h2>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${portfolio.contact?.email}`} className="link-email">
              {portfolio.contact?.email}
            </a>
          </p>
          <p>
            <strong>Phone:</strong> {portfolio.contact?.phone}
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer text-white text-center py-3">
        © {new Date().getFullYear()} {portfolio.name} | Portfolio
      </footer>
    </div>
  );
}

export default Home;
