const jwt = require("jsonwebtoken")

function restrict() {
	return async (req, res, next) => {
		const authError = {
			message: "You shall not pass!",
		}

		try {
			//const token = req.cookies.token if you want to use cookies
			const token = req.headers.token
			if (!token) {
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json(authError)
				}

				//req.token = decoded for cookies

				next()
			})
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict