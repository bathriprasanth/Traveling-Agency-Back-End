const User = require("../Models/UserModel");

// SIGNUP — Save new user to MongoDB
const SignupUser = async (req, res) => {
    try {
        console.log('--- SIGNUP REQUEST ---');
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const { name, email, phone, password } = req.body;

        // Check all required fields
        if (!name || !email || !phone || !password) {
            const missing = ['name','email','phone','password'].filter(f => !req.body[f]);
            console.log('Missing fields:', missing);
            return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const newUser = new User({ name, email, phone, password });
        const savedUser = await newUser.save();

        console.log('User saved:', savedUser._id);
        res.status(200).json({
            message: "User Registered Successfully",
            data: savedUser
        });
    } catch (error) {
        console.error('--- SIGNUP ERROR ---');
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

// LOGIN — Check email and password from MongoDB
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // Return user data to frontend for session
        res.status(200).json({
            message: "Login Successful",
            data: {
                name: user.name,
                email: user.email,
                isLoggedIn: true
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

// FORGOT PASSWORD — Update password in MongoDB
const ForgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Password reset failed", error: error.message });
    }
};

// PUT /api/user/update-profile — Update name and phone
const UpdateProfile = async (req, res) => {
    try {
        const { email, name, phone } = req.body;
        const user = await User.findOneAndUpdate(
            { email },
            { name, phone },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json({ message: "Profile updated successfully.", data: { name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: "Profile update failed.", error: error.message });
    }
};

// GET /api/user/profile/:email — Get user profile
const GetProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json({ data: { name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile.", error: error.message });
    }
};

// GET /api/user/all — Get all users (Admin)
const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).sort({ _id: -1 });
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users.", error: error.message });
    }
};

module.exports = { SignupUser, LoginUser, ForgotPassword, UpdateProfile, GetProfile, GetAllUsers };
