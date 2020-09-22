const express = require("express")
const Potlucks = require("./potlucks-model")
const restrict = require("../middleware/restrict")

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
router.get("/api/potlucks/:id", restrict(), validatePotluckId, async (req, res, next) => {
    try {
        const potluck = await Potlucks.findPotluckById(req.params.id)
        res.json(potluck)
    } catch(err) {
        next(err)
    }
})

// ADD POTLUCK
router.post("/api/potlucks", restrict(), async (req, res, next) => {
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
router.put("/api/potlucks/:id", restrict(), validatePotluckId, async (req, res, next) => {
    try {
        const { id } = req.params
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
router.post("/api/potlucks/:id", restrict(), validatePotluckId, async (req, res, next) => {
    try {
        const { id } = req.params
        const food = req.body

        Potlucks.addFoodToPotluck(food, id)
        .then(food => {
            res.status(201).json(food)
        })

    } catch(err) {
        res.status(409).json({
            message: "Food already exists for this potluck",
            err: err
        })
    }
})

// UPDATE FOOD TO TAKEN
router.put("/api/potlucks/:pid/foods/:fid", restrict(), async (req, res, next) => {
    try {
        const {pid, fid} = req.params
        const changes = req.body
        Potlucks.findPotluckFoodById(pid, fid)
        .then(food => {
            if (food) {
                Potlucks.updateTaken(pid, fid, changes)
                .then (updatedFood => {
                    res.json(updatedFood)
                })
            } else {
                res.status(404).json({ message: "You need to add this food to the potluck first."})
            }
        })
    } catch(err) {
        next(err)
    }
})

// ADD USER TO POTLUCK
router.post("/api/potlucks/:pid/users/:uid", restrict(), async (req, res, next) => {
    try {
        const { pid, uid } = req.params
        const user = req.body

        Potlucks.addUserToPotluck(user, id)
        .then(user => {
            res.status(201).json(user)
        })

    } catch(err) {
        next(err)
    }
})

// UPDATE USER TO ATTENDING
router.put("/api/potlucks/:pid/users/:uid", restrict(), async (req, res, next) => {
    try {

    } catch(err) {
        next(err)
    }
})

// DELETE POTLUCK
router.delete("/potluck/:id", validatePotluckId, (req, res, next) => {
	Users.deletePotluck(req.params.id)
		.then(() => {
			res.status(200).json({
				message: "The potluck has been deleted"
			})
		})
		.catch(next)
})



// middleware
function validatePotluckId(req, res, next) {
    
    Potlucks.findPotluckById(req.params.id)
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

module.exports = router