const request = require("supertest");
const app = require("../server");
const pool = require("../db");

describe("EventSpark API", () => {

    test("GET / should return API running message", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            message: "EventSpark API is running"
        });
    });


    test("GET /api/events should return events", async () => {

        const response = await request(app)
            .get("/api/events");

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);
    });


    test("GET /api/events/999999 should return 404 for missing event", async () => {

        const response = await request(app)
            .get("/api/events/999999");

        expect(response.statusCode).toBe(404);

        expect(response.body.message).toBe("Event not found");
    });

});
afterAll(async () => {
    await pool.end();
});
