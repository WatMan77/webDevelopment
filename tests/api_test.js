import { app } from "../app.js"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";


Deno.test({
    name: "Api with wrong parameters should give a message",
    fn: async() => {
        const testClient = await superoak(app);
        let response = await testClient.get('/api/summary/2020/5/12').expect("Invalid parameters.")
        //console.log(response);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: 'Retrieving an API from a day without any information should return all zeros.',
    fn: async() => {
        const testClient = await superoak(app);
        await testClient.get("/api/summary/2018/05/06").expect({
            duration: 0,
            quality: 0,
            sports: 0,
            study: 0,
            mood: null
            });
    },
    sanitizeResources: false,
    sanitizeOps: false,
}) //The api call works fine when made manually, but through tests it first complains about an error but still the query passes and returns
//the expected value.

