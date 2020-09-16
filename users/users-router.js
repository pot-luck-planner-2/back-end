const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./users-model")
const restrict = require("../middleware/restrict")

const router = express.Router()

router.get("/api/users", restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.post("/api/register", async (req, res, next) => {
	try {
		const { name, username, password, email, phone } = req.body
        
        const usernameConflict = await Users.findBy({ username }).first()
        const emailConflict = await Users.findBy({ email }).first()
        const phoneConflict = await Users.findBy({ phone }).first()
        

		if (usernameConflict) {
			return res.status(409).json({
				message: "That username is already taken.",
			})
        }
        
        if (emailConflict) {
			return res.status(409).json({
				message: "An account with that email already exists.",
			})
        }
        
        if (phoneConflict) {
			return res.status(409).json({
				message: "An account with that phone number already exists.",
			})
		}

		const newUser = await Users.add({
            name,
            username,
            password: await bcrypt.hash(password, 14),
            email,
            phone,
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/api/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		const passwordValid = await bcrypt.compare(password, user.password)

		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		const token = jwt.sign({
			userID: user.id,
		}, process.env.JWT_SECRET)

		res.cookie("token", token)

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})


module.exports = router