import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  // Fetch existing portfolio
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, e) => {
    const newProjects = [...form.projects];
    newProjects[index][e.target.name] = e.target.value;
    setForm({ ...form, projects: newProjects });
  };

  const addProject = () => {
    setForm({
      ...form,
      projects: [...form.projects, { title: "", description: "", github: "", demo: "" }],
    });
  };

  const removeProject = (index) => {
    const newProjects = [...form.projects];
    newProjects.splice(index, 1);
    setForm({ ...form, projects: newProjects });
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
        // update existing portfolio
        await axios.put(`http://127.0.0.1:5000/api/portfolio/${portfolio._id}`, data);
        alert("Portfolio updated successfully!");
      } else {
        // create new portfolio
        const res = await axios.post("http://127.0.0.1:5000/api/portfolio", data);
        setPortfolio(res.data.portfolio);
        alert("Portfolio created successfully!");
      }

      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Portfolio save error:", err.response || err);
      alert("Error saving portfolio. Check console for details.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "600px" }}>
        {/* Basic Info */}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea name="about" placeholder="About" value={form.about} onChange={handleChange} />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />

        {/* Projects */}
        <h3>Projects</h3>
        {form.projects.map((proj, index) => (
          <div key={index} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
            <input
              name="title"
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) => handleProjectChange(index, e)}
            />
            <input
              name="description"
              placeholder="Description"
              value={proj.description}
              onChange={(e) => handleProjectChange(index, e)}
            />
            <input
              name="github"
              placeholder="GitHub URL"
              value={proj.github}
              onChange={(e) => handleProjectChange(index, e)}
            />
            <input
              name="demo"
              placeholder="Demo URL"
              value={proj.demo}
              onChange={(e) => handleProjectChange(index, e)}
            />
            <button type="button" onClick={() => removeProject(index)} style={{ marginTop: "5px" }}>
              Remove Project
            </button>
          </div>
        ))}
        <button type="button" onClick={addProject} style={{ marginBottom: "10px" }}>
          Add Project
        </button>

        {/* Contact */}
        <h3>Contact</h3>
        <input name="email" placeholder="Email" value={form.contact.email} onChange={handleContactChange} />
        <input name="phone" placeholder="Phone" value={form.contact.phone} onChange={handleContactChange} />

        <button type="submit" style={{ marginTop: "10px" }}>
          Save Portfolio
        </button>
      </form>
    </div>
  );
}

export default Admin;
