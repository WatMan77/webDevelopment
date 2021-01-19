import { app } from "../app.js"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.78.0/testing/asserts.ts";

//Testin main GET requests to specific addresses when not logged in.
Deno.test({
    name: "GET request to root should work as is.",
    fn: async() => {
        const testClient = await superoak(app);
        await testClient.get('/')
        .expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
}); //Apparently async() leaks? Don't know why.

Deno.test({
    name: "GET request to /auth/login should work as is",
    fn: async() => {
        const testClient = await superoak(app);
        await testClient.get('/auth/login')
        .expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: "GET request to /auth/login should work as is",
    fn: async() => {
    const testClient = await superoak(app);
    await testClient.get('/auth/logout')
    .expect(200);   
    },
    sanitizeOps: false,
    sanitizeResources: false
})

Deno.test({
    name: "GET request to /auth/registration should work as is",
    fn: async() => {
        const testClient = await superoak(app);
        await testClient.get('/auth/registration')
        .expect(200);
    },
    sanitizeOps: false,
    sanitizeResources: false
})

Deno.test({
    name: "Get request to auth/logout should work as is",
    fn: async() => {
        const testClient = await superoak(app);
        await testClient.get('/auth/logout')
        .expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Get request to /behavior/summary without logging in should redirect to /auth/login",
    fn: async() => {
        const testClient = await superoak(app);
        let response = await testClient.get('/behavior/summary')
        .expect(200);
        assertStringIncludes(response.text, "<h1>Log in</h1>"); //This is how we know we are at auth/login
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Get request to /behavior/reporting without logging in should redirect to /auth/login",
    fn: async() => {
        const testClient = await superoak(app);
        let response = await testClient.get('/behavior/reporting')
        .expect(200);
        assertStringIncludes(response.text, "<h1>Log in</h1>");
    },
    sanitizeResources: false,
    sanitizeOps: false,
})