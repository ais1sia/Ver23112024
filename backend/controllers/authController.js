const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

//@desc Register
//@route POST /users
//@access public
const register = asyncHandler(async (req, res) => {
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
        res.status(201).json({ message: `User ${username} created successfully` });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
})

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.isActive) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    
        if (foundUser && match) {
            const today = new Date().setHours(0, 0, 0, 0);
            const lastLogin = foundUser.lastLogin ? new Date(foundUser.lastLogin).setHours(0, 0, 0, 0) : null;
        
            if (lastLogin && today - lastLogin === 86400000) {
                foundUser.streak += 1;
            } else {
                foundUser.streak = 1;
            }
            foundUser.lastLogin = new Date()
            await foundUser.save()
        }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "userId": foundUser.id,
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "userId": foundUser.id,
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    register,
    login,
    refresh,
    logout
}