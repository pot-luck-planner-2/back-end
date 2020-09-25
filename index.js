const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
//const cookieParser = require("cookie-parser") -- if you want to use cookies
const usersRouter = require("./users/users-router")
const potlucksRouter = require("./potlucks/potlucks-router")

const server = express()
const port = process.env.PORT || 8080

server.use(helmet())
server.use(cors())
server.use(express.json())

//server.use(cookieParser()) --if you want to use cookies

server.use(usersRouter)
server.use(potlucksRouter)
server.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Potluck API"
    })
})
server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})

module.exports = server