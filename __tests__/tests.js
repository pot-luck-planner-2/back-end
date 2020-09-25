const supertest = require("supertest")
const server = require("../index")
const db = require("../database/config")

let token

beforeEach(async () => {
    await db.seed.run()
    
    token = await supertest(server)
            .post("/api/login")
            .send({username: "admin", password: "abc12345"})
            .then(res => {
                return res.body.token;
            });
})

afterAll(async () => {
    await db.destroy()
})

// USERS
describe("users integration tests", () => {
    it("GET /api/users --returns a list of users", async () => {
        const res = await supertest(server)
            .get("/api/users")
            .set('Authorization', token)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body[0].name).toBe("admin")
    })

    it("GET /api/users --rejects users without a token", async () => {
        const res = await supertest(server)
            .get("/api/users")
        expect(res.statusCode).toBe(401)
    })

    it("POST /api/register --registers a new user", async () => {
        const res = await supertest(server)
            .post("/api/register")
            .send({
                name: "Dalton Cromer",
                username: "dscromer",
                password: "abc123",
                email: 'cromer.dalton@gmail.com',
                phone: 1115554567,
            })
        expect(res.statusCode).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body.name).toBe("Dalton Cromer")
    })

    it("GET /api/login --allows a user to login", async () => {
        const res = await supertest(server)
            .post("/api/login")
            .send({
                username: "admin",
                password: "abc12345"
            })
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Welcome admin!")
    })
})

describe("potluck integration tests", () => {
    it("GET /api/potlucks --returns a list of potlucks", async () => {
        const res = await supertest(server)
            .get("/api/potlucks")
            .set('Authorization', token)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.length).toBe(2)
        expect(res.body[0].name).toBe("My First Potluck")
    })

    it("GET /api/potlucks/:pid --returns a single potluck with given PID", async () => {
        const res = await supertest(server)
            .get("/api/potlucks/1")
            .set('Authorization', token)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.name).toBe("My First Potluck")
    })

    it("POST /api/potlucks --adds a new potluck", async () => {
        const res = await supertest(server)
            .post("/api/potlucks")
            .set('Authorization', token)
            .send({
                name: "Test Add Potluck",
                location: "testing",
                date: "2020-10-31",
                host_id: 1,
            })
        expect(res.statusCode).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body.name).toBe("Test Add Potluck")
    })

    it("PUT /api/potlucks/:pid --updates an existing potluck", async () => {
        const res = await supertest(server)
            .put("/api/potlucks/1")
            .set('Authorization', token)
            .send({
                name: "Test Update Potluck",
            })
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.name).toBe("Test Update Potluck")
    })

    it("PUT /api/potlucks/:pid --returns an error if you send an invalid PID", async () => {
        const res = await supertest(server)
            .put("/api/potlucks/3")
            .set('Authorization', token)
            .send({
                name: "Test Update Potluck",
            })
        expect(res.statusCode).toBe(400)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Invalid potluck id")
    })

    it("POST /api/potlucks/:pid --adds food to a potluck", async () => {
        const res = await supertest(server)
            .post("/api/potlucks/1")
            .set('Authorization', token)
            .send({
                name: "tacos",
            })
        expect(res.statusCode).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body[3].food_name).toBe("tacos")
    })

    it("PUT /api/potlucks/:pid/foods/:fid --updates isTaken property in potlucks_foods table", async () => {
        const res = await supertest(server)
            .put("/api/potlucks/1/foods/3")
            .set('Authorization', token)
            .send({
                isTaken: 1,
            })
            console.log(res.body)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body[0].isTaken).toBe(1)
    })
})