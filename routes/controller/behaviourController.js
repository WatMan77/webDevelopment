import * as behaviour from "../../service/behaviourSerivce.js"
import { getEmail } from "./authController.js"


const getToday = async() => {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    return `${year}-${month}-${day}`;
}

let morning = {
    date: await getToday(),
    duration: '',
    quality: '',
    mood: '',
    user_id: '',
    errors: null,
    user: '',
}

const showMorning = async({render, session}) => {
    await session.set('form', 'morning')
     morning = {
        date: await getToday(),
        duration: '',
        quality: '',
        mood: '',
        user_id: await session.get('id'),
        errors: null,
        user: await getEmail({session})
    }
    render('morning.ejs', morning);
}

const addMorning = async({request, render, session}) => {
    const body = request.body();
    const params = await body.value;

    const data = {
        date: params.get('date'),
        duration: Number(params.get('duration')),
        quality: Number(params.get('quality')),
        mood: Number(params.get('mood')),
        user_id: await session.get('id'),
        errors: null,
    }

   const res = await behaviour.addMorning(data)
   res.user = await getEmail({session});
    render('morning.ejs', res);

    //response.redirect('/behavior/reporting');
}

const showEvening = async({render, session}) => {
    await session.set('form', 'evening')
    const data = {
        date: await getToday(),
        sports: '',
        study: '',
        eating: '',
        mood:'',
        user_id: '',
        errors: null,
        user: await getEmail({session})
    }
    render('evening.ejs', data)
}

const addEvening = async({request, render, session, response}) => {
    const body = request.body();
    const params = await body.value;

    const data = {
        date: params.get('date'),
        sports: Number(params.get('sports')),
        study: Number(params.get('study')),
        eating: Number(params.get('eating')),
        mood: Number(params.get('mood')),
        user_id: await session.get('id'),
        errors: null,
    }
    const res = await behaviour.addEvening(data);
    res.user = await getEmail({session});
    render('evening.ejs', res);

}

const showBehaviour = async({request, render, session}) => {
    const res = request.url.search
    if(res.includes('morning')){
       await showMorning({render, session});
    } else if(res.includes('evening')){
       await showEvening({render, session});
    } else {
        const data = await behaviour.reportStatus(await session.get('id'));
        data.user = await getEmail({session});
        render('behaviour.ejs', data);
    }
}

const postBehaviour = async({request, render, session, response}) => {
    const res = await session.get('form');
    if(res === 'morning'){
        await addMorning({request, render, session, response});
    } else if(res === 'evening'){
       await  addEvening({request, render, session, response});
    } else {
        response.body = "Failed to send"
    }
}

export { showBehaviour, postBehaviour, getToday }