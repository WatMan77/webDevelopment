import { config } from "../deps.js";

let conf = {};
let env = config();

/*if (Deno.env.get('TEST_ENVIRONMENT')) {
  conf.database = {};
} else {
  conf.database = {
    hostname: env.HOST,
    database: env.USER,
    user: env.USER,
    password: env.PASSWORD,
    port: 5432
  };
}*/ //This should not be needed
conf.database = {
    hostname: env.HOST,
    database: env.USER,
    user: env.USER,
    password: env.PASSWORD,
    port: 5432
  };

export { conf };