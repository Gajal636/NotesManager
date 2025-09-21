import React, { useState, useEffect } from "react";
import axios from "axios"

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");

  // Fetch notes on load
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("/viewNotes");
      setNotes(res.data);
    } catch (err) {
      setMessage("❌ Failed to fetch notes");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addNote = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/addNotes", form);
      setNotes([...notes, res.data.data]);
      setForm({ title: "", content: "" });
      setMessage("✅ Note added");
    } catch (err) {
      setMessage("❌ Failed to add note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/deleteNotes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
      setMessage("🗑️ Note deleted");
    } catch (err) {
      setMessage("❌ Failed to delete note");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Notes</h2>

      {/* Add Note Form */}
      <form onSubmit={addNote} className="mb-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
          Add Note
        </button>
      </form>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="p-4 bg-gray-100 rounded-lg shadow flex justify-between"
          >
            <div className="flex-1">
              <h3 className="font-bold">{note.title}</h3>

              {/* Scrollable content */}
              <div className="max-h-40 overflow-y-auto p-2 bg-white rounded border">
                <p className="whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>

            <button
              onClick={() => deleteNote(note._id)}
              className="text-red-500 hover:underline ml-4"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default Notes;



