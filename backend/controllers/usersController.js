const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users);
});

// @desc Create a new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, firstname, lastname, password, level, roles, goals, isActive } = req.body

    if (!username || !email || !firstname || !lastname || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    // !Array.isArray(roles) || !Array.isArray(level) || !Array.isArray(goals)
    //409: conflict
    const duplicate = await User.findOne({
        $or: [{ email }, { username }]
    }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
    if (duplicate) {
        return res.status(409).json({ message: 'Email or username already in use' })
    }
    

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = {
        username,
        email,
        firstname,
        lastname,
        password: hashedPwd,
        roles: roles && roles.length ? roles : ['User'],
        goals: goals && goals.length ? goals : ['general'],
        level: level || 'beginner',
        isActive: isActive || true
    };

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `User ${username} created successfully` })
    } else {
        res.status(400).json({ message: 'Invalid user data' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, firstname, lastname, level, roles, goals, isActive, password } = req.body

    if (!id ) {
        return res.status(400).json({ message: 'ID is required' })
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({
        $or: [{ email }, { username }]
    }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
    if (duplicate) {
        return res.status(409).json({ message: 'Email or username already in use' })
    }

    if(username) user.username = username
    if(email) user.email = email
    if(firstname) user.firstname = firstname
    if(lastname) user.lastname = lastname
    if(level) user.level = level || user.level
    if(roles) user.roles = roles || user.roles
    if(goals) user.goals = goals || user.goals
    if(isActive) user.isActive = isActive || user.isActive

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `User ${updatedUser.username} updated successfully` })
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `User deleted`

    res.json(reply)
    
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
};
