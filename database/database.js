import { conf } from "../configurations/config.js"
import { Pool } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const connectionPool = new Pool(conf.database, 2);
/*const DATABASE_URL = Deno.env.toObject().DATABASE_URL;
const connectionPool = new Pool(DATABASE_URL, 1);*/ //This is for heroku

const executeQuery = async(query, ...args) => {
    const client = await connectionPool.connect();
    try {
        return await client.query(query, ...args);
    } catch (e) {
        console.log(e);
    } finally {
       await client.release();
    }
    return null;
}

export { executeQuery }