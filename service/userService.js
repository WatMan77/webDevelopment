import { executeQuery } from "../database/database.js"
import { bcrypt } from "../deps.js"
import { isEmail, validate, required, minLength, maxNumber} from "../deps.js"

const register = async(pars) => {
    const validationRules = {
        email: [required, isEmail],
        password: [required, minLength(4)],
        Email_is_used: [maxNumber(0)]
    }
    let email = pars.email;
    let password = pars.password;
    const isUsed = await executeQuery("SELECT email FROM users WHERE email = $1", email);
    const data = {
        email: email,
        password: password,
        Emai_is_used: isUsed.rowCount
    }
    const [passes, errors] = await validate(data, validationRules)

    if(passes && isUsed.rowCount === 0){
        const hash = await bcrypt.hash(password);
        await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2)", email, hash);
        return {email: '', errors: '', user: pars.user};
    } else {
        console.log("Registration failed")
        const error = {
            email: email,
            errors: errors,
            message: '',
            user: pars.user
        }
        if(isUsed.rowCount !== 0){
            error.message = 'Email already registered'
        }
        //Should we tell if email is taken?
        return error;
    }
}

export { register }