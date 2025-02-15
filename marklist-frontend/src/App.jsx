import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";


function App() {
  const [marks, setMarks] = useState([]);
  const [formData, setFormData] = useState({ student_name: "", subject: "", marks: "" });
  const [editingId, setEditingId] = useState(null);
  const [latestEntry, setLatestEntry] = useState(null);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    const response = await axios.get("http://localhost:5000/marks");
    setMarks(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    if (editingId) {
      response = await axios.put(`http://localhost:5000/marks/${editingId}`, formData);
    } else {
      response = await axios.post("http://localhost:5000/marks", formData);
    }
    setLatestEntry(response.data);
    setFormData({ student_name: "", subject: "", marks: "" });
    setEditingId(null);
    fetchMarks(); // Fetch marks again to update the list immediately
  };

  const handleEdit = (mark) => {
    setFormData({ student_name: mark.student_name, subject: mark.subject, marks: mark.marks });
    setEditingId(mark.id);
  };

  return (
    <div>
      <h2>Mark List</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="student_name" placeholder="Student Name" value={formData.student_name} onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
        <input type="number" name="marks" placeholder="Marks" value={formData.marks} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update" : "Add"} Mark</button>
      </form>
      {latestEntry && (
        <div>
          <h3>Latest Entry</h3>
          <p>{latestEntry.student_name} - {latestEntry.subject} - {latestEntry.marks}</p>
        </div>
      )}
      <ul>
        {marks.map((mark) => (
          <li key={mark.id}>
            {mark.student_name} - {mark.subject} - {mark.marks}
            <button onClick={() => handleEdit(mark)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
