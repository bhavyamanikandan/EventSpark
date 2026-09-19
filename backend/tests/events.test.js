const request = require("supertest");
const app = require("../server");

describe("EventSpark API Tests", () => {

    test("GET / should return API status", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

    test("GET /api/events should return an array of events", async () => {
        const response = await request(app).get("/api/events");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("title");
    });

    test("GET /api/events/999999 should return 404", async () => {
        const response = await request(app).get("/api/events/999999");

        expect(response.statusCode).toBe(404);
    });

});