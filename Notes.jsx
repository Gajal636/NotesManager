import React from "react";
import api from "/axios";

const Notes = () => {
  const [notes, setNotes] = React.useState([]);
  const [form, setForm] = React.useState({ title: "", content: "" });
  const [message, setMessage] = React.useState("");
  
  React.useEffect(() => {
    fetchNotes();
  }, []);
  
  const fetchNotes = async () => {
    try {
      const res = await api.get("/viewNotes");
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
      const res = await api.post("/addNotes", form);
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
  
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
          <form onSubmit={addNote} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Note Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            />
            <textarea
              name="content"
              placeholder="Note Content"
              value={form.content}
              onChange={handleChange}
              className="w-full p-3 border rounded-md h-32"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            >
              Add Note
            </button>
          </form>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            {message}
          </div>
        )}

        <div className="grid gap-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notes yet. Add your first note above!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {note.title}
                  </h3>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="max-h-40 overflow-y-auto p-3 bg-gray-50 rounded border">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {note.content}
                  </p>
                </div>
                
                {note.createdAt && (
                  <small className="text-gray-400 mt-2 block">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </small>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;

