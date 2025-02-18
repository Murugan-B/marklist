import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [marks, setMarks] = useState([]);
  const [formData, setFormData] = useState({ student_name: "", subject: "", marks: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMarks();
  }, []);

  
  const fetchMarks = async () => {
    const response = await axios.get("http://localhost:8000/marks");
    setMarks(response.data);
  };

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8000/marks/${editingId}`, formData);
    } else {
      await axios.post("http://localhost:8000/marks", formData);
    }
    setFormData({ student_name: "", subject: "", marks: "" });
    setEditingId(null);
    fetchMarks();
  };


  const handleEdit = (mark) => {
    setFormData({ student_name: mark.student_name, subject: mark.subject, marks: mark.marks });
    setEditingId(mark.id);
  };

  
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/marks/${id}`);
    fetchMarks(); 
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

      
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark) => (
            <tr key={mark.id}>
              <td>{mark.student_name}</td>
              <td>{mark.subject}</td>
              <td>{mark.marks}</td>
              <td>
                <button onClick={() => handleEdit(mark)}>Edit</button>
                <button onClick={() => handleDelete(mark.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
