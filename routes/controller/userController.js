import { register } from "../../service/userService.js"
import { getEmail } from "./authController.js"

const showRegister = async({render, session}) => {
    const data = {
        errors: null,
        email: '',
        user: await getEmail({session})
    }
    render('user.ejs', data);
}

const reg = async({render, request, response, session}) => {
    const body = request.body();
    const pars = await body.value;
    const data = {
        email: pars.get('email'),
        password: pars.get('password'),
        user: await getEmail({session}),
    }
    render('user.ejs', await register(data));
}

export { reg, showRegister }