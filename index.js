const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end(); // Respond with no content instead of 404
});


// ==================== Middleware ====================
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  credentials: true
}));
app.use(cookieParser());

// ==================== Database ====================
mongoose.connect("mongodb://localhost:27017/NotesManager")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.log("❌ Connection failed:", err));

// ==================== Schemas ====================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", userSchema);

const notesSchema = new mongoose.Schema({
  title: String,
  content: String,
  user_id: String
}, { timestamps: true });
const Notes = mongoose.model("Notes", notesSchema);

// ==================== Auth Middleware ====================
const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "unauthorized" });

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "invalid-token" });
  }
};

// ==================== Routes ====================

// ✅ Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid Credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name },
      "secret_key",
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    res.json({ success: true, user: { _id: user._id, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Logout
app.post("/logout", (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });
  res.json({ success: true, message: "Logged out successfully" });
});

// ✅ Add Note
app.post("/addNotes", authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title && !content) throw new Error("Note data required");

    const note = await Notes.create({
      title,
      content,
      user_id: req.user.id
    });

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ✅ View Notes
app.get("/viewNotes", authenticate, async (req, res) => {
  try {
    const notes = await Notes.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ✅ Delete Note
app.delete("/deleteNotes/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Notes.findById(id);

    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    if (note.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Notes.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ==================== Start Server ====================
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
