import { login, logout } from "../../service/authService.js"

const getEmail = async({session}) => {
    let user = '';
    let sessionUser = await session.get('email');
    if(sessionUser){
        user = sessionUser;
    }
    return user;
}


const logging = async({request, session, render}) => {
    const body = request.body();
    const pars = await body.value;
    render('auth.ejs', {message: await login(pars, {session}), user: await getEmail({session})})
}

const showLogin = async({render, session}) => {
    render('auth.ejs', {message: '', user: await getEmail({session})})
}

const logO = async({render, session}) => {
    render('logout.ejs', {message: await logout({session}), user: await getEmail({session})})
}

const showLogout = async({render, session}) => {
    render('logout.ejs', {message: '', user: await getEmail({session})});
}


export { logging, showLogin, logO, showLogout, getEmail }