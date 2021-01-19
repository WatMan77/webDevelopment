import * as behavior  from "../service/behaviourSerivce.js"
import { assertEquals, assertStringIncludes, assertNotEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { app } from "../app.js"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { executeQuery } from "../database/database.js"

Deno.test({
    name: "Not giving enough data to addMorning should return errors",
    fn: async() => {
        const params = {
            duration: 2,
            quality: 3,
            mood: 3
        }
        const result = await behavior.addMorning(params)
        assertNotEquals(Object.keys(result.errors).length, 0);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Not giving enough data to addEvening should return errors",
    fn: async() => {
        const params = {
            sports: 2,
            mood: 3
        }
        const result = await behavior.addEvening(params);
        assertNotEquals(Object.keys(result.errors).length, 0);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Giving correct data to addMorning should not produce any errors",
    fn: async() => {
        const id = (await executeQuery("SELECT id FROM users WHERE email = 'testguy@gmail.com'")).rowsOfObjects()[0].id;
        const data = {
            date: '2015-06-12',
            duration: 2,
            quality: 3,
            mood: 2,
            user_id: id
        }
        let res = await behavior.addMorning(data);
        assertEquals(res.errors, null);

    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Giving correct data to addEvening should not produce any errors",
    fn: async() => {
        const id = (await executeQuery("SELECT id FROM users WHERE email = 'testguy@gmail.com'")).rowsOfObjects()[0].id;
        const data = {
            date: '2015-06-12',
            sports: 2,
            study: 3,
            eating: 3,
            mood: 5,
            user_id: id
        }
        let res = await behavior.addEvening(data);
        assertEquals(res.errors, null);
    }
})