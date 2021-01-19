import * as regis from "../service/userService.js"
import { assertEquals, assertStringIncludes, assertNotEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";

Deno.test({
    name: "Cannot register a user that already exists",
    fn: async() => {
        const data = {
            email: 'testguy@gmail.com',
            password: 'abc123',
        }
        let res = await regis.register(data);
        assertEquals(res.message, "Email already registered");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Cannot register, if email is not valid/in correct format",
    fn: async() => {
        const data = {
            email: "testguy",
            password: "abc123",
        }
        let res = await regis.register(data);
        assertEquals(res.errors.email.isEmail, "email is not a valid email address");
    }
});

Deno.test({
    name: "Cannot register, if password is not at least 4 characters long",
    fn: async() => {
        const data = {
            email: 'newguy@gmail.com',
            password: "abc",
        }
        let res = await regis.register(data);
        console.log(res)
        assertNotEquals(Object.keys(res.errors).length, 0);
        assertEquals(res.errors.password.minLength, "password cannot be lower than 4 characters");
    }
})