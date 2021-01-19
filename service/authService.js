import { executeQuery } from "../database/database.js"
import { bcrypt } from "../deps.js"
import { isEmail, validate, required } from "../deps.js"


const login = async(params, {session}) => {
    const user = await executeQuery("SELECT * FROM users WHERE email = $1", params.get('email'));
    if(user.rowCount === 0){
        return 'Invalid email or password';
    }
    const userObj = user.rowsOfObjects()[0];
    const hash = userObj.password; //Password as a hash
    const correct = await bcrypt.compare(params.get('password'), hash);
    const validationRules = {
        Email: [required, isEmail],
        Password: [required]
        
    }
    const data = {
        Email: userObj.email,
        Password: hash
    }
    const [passes, errors] = await validate(data, validationRules)
    if(!passes || user.rowCount === 0 || !correct){
        console.log(errors) //Testing purposes
        return 'Invalid email or password'
    } else {
        await session.set('id', userObj.id);
        await session.set('email', userObj.email);
        return 'Login successful!';
    }
}

const logout = async({session}) => {
    await session.set('id', '');
    await session.set('email', '');
    return "Successfully logged out!";
}

export { login, logout }