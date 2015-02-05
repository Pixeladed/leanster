var assert = require("assert");
var request = require("supertest");
var app = require("../app.js");


describe("Leanster", function() {
	describe("requests", function() {
		describe("GET /", function() {
			it("should return homepage",function(done) {
				request(app)
					.get("/")
					.set("Accept","text/html")
					.expect(200,done);
			});
		});
		describe("GET /:id", function() {
			it("should return homepage",function(done) {
				request(app)
					.get("/")
					.set("Accept","text/html")
					.expect(200,done);
			});
		});
	});
});