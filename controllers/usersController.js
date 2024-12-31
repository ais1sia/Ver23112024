const User = require('../models/User');
const Material = require('../models/Material');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
});

// @desc Create a new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, firstname, lastname, password, level, roles, goal } = req.body;

    if (!username || !email || !firstname || !lastname || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await User.findOne({ email }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = {
        username,
        email,
        firstname,
        lastname,
        password: hashedPassword,
    };

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `User ${username} created successfully` });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, firstname, lastname, level, roles, goal, active, password } = req.body;

    if (!id || !username || !email || !firstname || !lastname || !level) {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.level = level;
    user.roles = roles || user.roles;
    user.goal = goal || user.goal;
    user.active = active !== undefined ? active : user.active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `User ${updatedUser.username} updated successfully` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const result = await user.deleteOne();

    res.json({ message: `User ${result.username} deleted successfully` });
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
};
