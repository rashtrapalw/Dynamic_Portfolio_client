import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [form, setForm] = useState({
    name: "",
    title: "",
    about: "",
    skills: "",
    projects: [],
    contact: { email: "", phone: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/portfolio");
        if (res.data) {
          setPortfolio(res.data);
          setForm({
            name: res.data.name || "",
            title: res.data.title || "",
            about: res.data.about || "",
            skills: (res.data.skills || []).join(", "),
            projects: res.data.projects || [],
            contact: res.data.contact || { email: "", phone: "" },
          });
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProjectChange = (index, e) => {
    const updated = [...form.projects];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, projects: updated });
  };

  const addProject = () => {
    setForm({
      ...form,
      projects: [...form.projects, { title: "", description: "", github: "", demo: "" }],
    });
  };

  const removeProject = (index) => {
    const updated = [...form.projects];
    updated.splice(index, 1);
    setForm({ ...form, projects: updated });
  };

  const handleContactChange = (e) => {
    setForm({ ...form, contact: { ...form.contact, [e.target.name]: e.target.value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (portfolio?._id) {
        await axios.put(`http://127.0.0.1:5000/api/portfolio/${portfolio._id}`, data);
        alert("Portfolio updated successfully!");
      } else {
        const res = await axios.post("http://127.0.0.1:5000/api/portfolio", data);
        setPortfolio(res.data.portfolio);
        alert("Portfolio created successfully!");
      }
      navigate("/");
    } catch (err) {
      console.error("Error saving portfolio:", err.response || err);
      alert("Error saving portfolio.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 border-0 rounded-4">
        <h2 className="text-center mb-4 text-primary fw-bold">Admin Panel</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label fw-semibold">About</label>
            <textarea
              className="form-control"
              name="about"
              rows="3"
              value={form.about}
              onChange={handleChange}
            />
          </div>

          <div className="mt-3">
            <label className="form-label fw-semibold">Skills (comma separated)</label>
            <input
              className="form-control"
              name="skills"
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <h4 className="mt-4 text-secondary fw-bold">Projects</h4>
          {form.projects.map((proj, index) => (
            <div key={index} className="card p-3 mt-3 border-0 shadow-sm">
              <div className="row g-2">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    name="title"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => handleProjectChange(index, e)}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    name="description"
                    placeholder="Description"
                    value={proj.description}
                    onChange={(e) => handleProjectChange(index, e)}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    name="github"
                    placeholder="GitHub URL"
                    value={proj.github}
                    onChange={(e) => handleProjectChange(index, e)}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    name="demo"
                    placeholder="Demo URL"
                    value={proj.demo}
                    onChange={(e) => handleProjectChange(index, e)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="btn btn-outline-danger btn-sm mt-3"
              >
                Remove Project
              </button>
            </div>
          ))}

          <button type="button" onClick={addProject} className="btn btn-success mt-3">
            + Add Project
          </button>

          <h4 className="mt-4 text-secondary fw-bold">Contact</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                name="email"
                placeholder="Email"
                value={form.contact.email}
                onChange={handleContactChange}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                name="phone"
                placeholder="Phone"
                value={form.contact.phone}
                onChange={handleContactChange}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-primary px-4 py-2 rounded-3">
              Save Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Admin;
