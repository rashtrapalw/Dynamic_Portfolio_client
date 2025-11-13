import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css"; // custom animations
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
    <div>
      {/* Hero Section */}
      <header className="bg-dark text-white text-center py-5 hero-section">
        <h1 className="display-4 animate__fadeIn">{portfolio.name}</h1>
        <p className="lead animate__fadeIn animate__delay-1s">{portfolio.title}</p>
      </header>

      <div className="container my-5">
        {/* About Section */}
        <section id="about" className="mb-5 section-animate">
          <h2 className="mb-3">About Me</h2>
          <p>{portfolio.about}</p>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-5 section-animate">
          <h2 className="mb-3">Skills</h2>
          <div className="d-flex flex-wrap gap-2">
            {portfolio.skills?.map((skill, i) => (
              <span key={i} className="badge bg-primary p-2">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-5 section-animate">
          <h2 className="mb-3">Projects</h2>
          <div className="row">
            {portfolio.projects?.map((project, i) => (
              <div key={i} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm animate__fadeInUp">
                  <div className="card-body">
                    <h5 className="card-title">{project.title}</h5>
                    <p className="card-text">{project.description}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-dark btn-sm"
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

        {/* Contact Section */}
        <section id="contact" className="mb-5 section-animate">
          <h2 className="mb-3">Contact</h2>
          <p>
            Email:{" "}
            <a href={`mailto:${portfolio.contact?.email}`}>
              {portfolio.contact?.email}
            </a>
          </p>
          <p>Phone: {portfolio.contact?.phone}</p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        &copy; {new Date().getFullYear()} {portfolio.name} | Portfolio
      </footer>
    </div>
  );
}

export default Home;
