const express = require("express")
const Potlucks = require("./potlucks-model")
const restrict = require("../middleware/restrict")
const Users = require("../users/users-model")

const router = express.Router()


// GET ALL POTLUCKS
router.get("/api/potlucks", restrict(), async (req, res, next) => {
    try {
        const potlucks = await Potlucks.findPotlucks()
        res.json(potlucks)
    } catch(err) {
        next(err)
    }
})

// GET POTLUCK BY ID
router.get("/api/potlucks/:pid", restrict(), validatePotluckId, async (req, res, next) => {
    try {
        const potluck = await Potlucks.findPotluckById(req.params.pid)
        res.json(potluck)
    } catch(err) {
        next(err)
    }
})

// ADD POTLUCK
router.post("/api/potlucks", restrict(), (req, res, next) => {
    try {
        const potluckData = req.body
        Potlucks.addPotluck(potluckData)
        .then(potluck => {
            res.status(201).json(potluck)
        })

    } catch(err) {
        next(err)
    }
})

// UPDATE POTLUCK
router.put("/api/potlucks/:pid", restrict(), validatePotluckId, (req, res, next) => {
    try {
        const { pid } = req.params
        const potluckData = req.body
        Potlucks.findPotluckById(id)
        .then(potluck => {
            if (potluck) {
                Potlucks.updatePotluck(potluckData, id)
                .then (updatePotluck => {
                    res.json(updatePotluck)
                })
            } else {
                res.status(404).json({ message: 'Could not find potluck with given ID'})
            }
        })

    } catch(err) {
        next(err)
    }
})

// ADD FOOD TO POTLUCK
router.post("/api/potlucks/:pid", restrict(), validatePotluckId, async (req, res, next) => {
    try {
        const { pid } = req.params
        const food = req.body
        console.log(req.body)
        const addedFood = await Potlucks.addFoodToPotluck(food, pid)
        console.log(addedFood)
        res.status(201).json(addedFood)

    } catch(err) {
        next(err)
    }
})

// GET ALL POTLUCK FOOD
router.get("/api/potlucks/:pid/foods", restrict(), validatePotluckId, async (req, res, next) => {
    try {
        const { pid } = req.params
        const potluckfoods =  await Potlucks.findAllPotluckFood(pid)
        res.json(potluckfoods)

    } catch(err) {
        next(err)
    }
})

// UPDATE FOOD TO TAKEN
router.put("/api/potlucks/:pid/foods/:fid", restrict(), validatePotluckId, validateFoodId, async (req, res, next) => {
    try {
        const {pid, fid} = req.params
        const changes = req.body
        const potluck = await Potlucks.findPotluckFoodById(pid, fid)
            if (potluck) {
                 const updatedFood = await Potlucks.updateTaken(pid, fid, changes)
                res.json(updatedFood)
            } else {
                res.status(404).json({ message: "You need to add this food to the potluck first."})
            }
        } catch(err) {
        next(err)
    }
})

// ADD GUEST(user) TO POTLUCK
router.post("/api/potlucks/:pid/users/:uid", restrict(), validatePotluckId, validateUserId, async (req, res, next) => {
    try {
        const { pid, uid } = req.params
        const guest = await Potlucks.findPotluckGuestById(pid, uid)
        console.log(guest)
        if (guest.length) {
            res.status(409).json({ message: "This guest has already been invited to your potluck."})
        } else {
            Potlucks.addUserToPotluck(pid, uid)
        .then(user => {
            res.status(201).json(user)
        })
        }

    } catch(err) {
        next(err)
    }
})

// GET POTLUCK GUEST BY ID
router.get("/api/potlucks/:pid/users/:uid", validatePotluckId, validateUserId, restrict(), async (req, res, next) => {
    try {
        const { pid, uid } = req.params
        const guest = await Potlucks.findPotluckGuestById(pid, uid)
        res.json(guest)
    } catch(err) {
        next(err)
    }
})

// UPDATE USER TO ATTENDING
router.put("/api/potlucks/:pid/users/:uid", restrict(), validatePotluckId, validateUserId, async (req, res, next) => {
    try {
    const { pid, uid } = req.params
    const changes = req.body
    const guest = await Potlucks.findPotluckGuestById(pid, uid)
    if (guest) {
        const updatedGuest = await Potlucks.updateAttending(pid, uid, changes)
        res.json(updatedGuest)
    } else {
        res.status(404).json({message: "That user has not been added to this potluck yet."})
    }

    } catch(err) {
        next(err)
    }
})

// DELETE POTLUCK
router.delete("/api/potlucks/:pid", validatePotluckId, (req, res, next) => {
	Potlucks.deletePotluck(req.params.pid)
		.then(() => {
			res.status(200).json({
				message: "The potluck has been deleted"
			})
		})
		.catch(next)
})



// middleware
function validatePotluckId(req, res, next) {
    
    Potlucks.findPotluckById(req.params.pid)
        .then(potluck => {
            if (potluck) {
                req.potluck = potluck
                next();
            } else {
                res.status(400).json({ message: "Invalid potluck id" });
            }
        })
        .catch(err => {
            console.log("error:", err);
            res.status(500).json({ message: `there was a problem with your ${req.method} request` })
        })
}

function validateUserId(req, res, next) {
    
    Users.findUserById(req.params.uid)
        .then(user => {
            if (user) {
                req.user = user
                next();
            } else {
                res.status(400).json({ message: "Invalid user id" });
            }
        })
        .catch(err => {
            console.log("error:", err);
            res.status(500).json({ message: `there was a problem with your ${req.method} request` })
        })
}

function validateFoodId(req, res, next) {
    
    Potlucks.findFoodById(req.params.fid)
        .then(food => {
            if (food) {
                req.food = food
                next();
            } else {
                res.status(400).json({ message: "Invalid food id" });
            }
        })
        .catch(err => {
            console.log("error:", err);
            res.status(500).json({ message: `there was a problem with your ${req.method} request` })
        })
}

module.exports = router