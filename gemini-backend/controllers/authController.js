import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Register User >>
export const register = async (req, res) => {
  const { name, email, password, college } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      college,
      marks: [],
      profilePicture: "",
      bio: "",
    });
    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        college: newUser.college,
        marks: newUser.marks,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res
      .status(200)
      .json({
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          college: user.college,
          marks: user.marks,
          profilePicture: user.profilePicture,
          bio: user.bio,
        },
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout (Just a frontend token removal)
export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, college, bio, profilePicture } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (college) user.college = college;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add marks/exam results
export const addMarks = async (req, res) => {
  try {
    const { examName, marks, totalMarks } = req.body;
    
    if (!examName || !marks || !totalMarks) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const percentage = ((marks / totalMarks) * 100).toFixed(2);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.marks.push({
      examName,
      marks,
      totalMarks,
      percentage: parseFloat(percentage),
    });

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete marks
export const deleteMarks = async (req, res) => {
  try {
    const { markId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.marks = user.marks.filter(mark => mark._id.toString() !== markId);
    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
