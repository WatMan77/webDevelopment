import { app } from "../app.js"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.78.0/testing/asserts.ts";

Deno.test({
    name: "Logging with a dummy user should be successful",
    fn: async() => {
        const testClient = await superoak(app);
       let response = await testClient.post('/auth/login')
        .send('email=testguy@gmail.com&password=abc123')
        .expect(200);
        assertStringIncludes(response.text, "Login successful!");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Logging with a nonregistered user should fail logging in",
    fn: async() => {
        const testClient = await superoak(app);
        let response = await testClient.post('/auth/login')
        .send('email=notregistered@hotmail.com&password=nopassword')
        .expect(200);
        assertStringIncludes(response.text, "Invalid email or password");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Giving a wrong password should give an error in logging",
    fn: async() => {
        const testClient = await superoak(app);
        let response = await testClient.post('/auth/login')
        .send('email=testguy@gmail.com&password=wrongpassword')
        .expect(200);
        assertStringIncludes(response.text, "Invalid email or password");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Logging in and then logging out should work",
    fn: async() => {
        let testClient = await superoak(app);
        let response = await testClient.post('/auth/login')
        .send('email=testguy@gmail.com&password=abc123')
        .expect(200);
        let headers = response.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        testClient = await superoak(app);
        testClient = await superoak(app);
        let response3 = await testClient.post('/auth/logout')
        .set("Cookie", cookie)
        .send()
        .expect(200);
        assertStringIncludes(response3.text, "Successfully logged out!");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Logged user should be able to access /behavior/summary",
    fn: async() => {
        let testClient = await superoak(app);
        let response = await testClient.post('/auth/login')
        .send('email=testguy@gmail.com&password=abc123')
        .expect(200);
        let headers = response.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        testClient = await superoak(app);
        let response2 = await testClient
        .get('/behavior/summary')
        .set("Cookie", cookie)
        .expect(200);
        assertStringIncludes(response2.text, "<h1>Summary for the week</h1>");
        
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Logged user should be able to access /behavior/reporting and its forms",
    fn: async() => {
        let testClient = await superoak(app);
        let response = await testClient.post('/auth/login')
        .send('email=testguy@gmail.com&password=abc123')
        .expect(200);
        let headers = response.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        testClient = await superoak(app);
        let response2 = await testClient
        .get("/behavior/reporting")
        .set("Cookie", cookie)
        .expect(200);
        assertStringIncludes(response2.text, "<h1>Choose a form</h1>");

        testClient = await superoak(app);
        let morning = await testClient
        .get("/behavior/reporting?type=morning")
        .set("Cookie", cookie)
        .expect(200);
        assertStringIncludes(morning.text, "<h1>How was your night?</h1>");

        testClient = await superoak(app);
        let evening = await testClient
        .get("/behavior/reporting?type=evening")
        .set("Cookie", cookie)
        .expect(200);
        assertStringIncludes(evening.text, "<h1>How was your day?</h1>");

    },
    sanitizeResources: false,
    sanitizeOps: false,
});