const User = require("../Models/UserModel");

// SIGNUP — Save new user to MongoDB
const SignupUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            const missing = ['name', 'email', 'phone', 'password'].filter(f => !req.body[f]);
            return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const newUser = new User({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password
        });

        const savedUser = await newUser.save();

        return res.status(201).json({
            message: "User Registered Successfully",
            data: {
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                role: savedUser.role
            }
        });
    } catch (error) {
        console.error('[SignupUser Error]', error.message);
        // Handle MongoDB duplicate key race condition
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already registered." });
        }
        return res.status(500).json({ message: "Registration failed. Please try again.", error: error.message });
    }
};

// LOGIN — Check email and password from MongoDB
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // Return role so frontend can route admin vs user correctly
        res.status(200).json({
            message: "Login Successful",
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                isLoggedIn: true
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

// GET /api/user/seed-admin — Create admin account if it does not exist
const SeedAdmin = async (req, res) => {
    try {
        const existing = await User.findOne({ email: 'admin@aspire.com' });
        if (existing) {
            return res.status(200).json({ message: 'Admin already exists.', data: { email: existing.email, role: existing.role } });
        }
        const admin = new User({
            name: 'Admin',
            email: 'admin@aspire.com',
            phone: '0000000000',
            password: 'Admin123',
            role: 'admin'
        });
        await admin.save();
        res.status(201).json({ message: 'Admin account created successfully.', data: { email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(500).json({ message: 'Failed to seed admin.', error: error.message });
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

module.exports = { SignupUser, LoginUser, ForgotPassword, UpdateProfile, GetProfile, GetAllUsers, SeedAdmin };
