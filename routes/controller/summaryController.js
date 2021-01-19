import { executeQuery } from "../../database/database.js";
import { morningWeek, morningMonth, eveningWeek, eveningMonth, changeDate, moodAverageWeek, moodAverageMonth } from "../../service/summaryService.js"
import { getEmail } from "./authController.js"

const data = {
    morning: '',
    evening: '',
}

const showAverages = async({render, session}) => {
    const id = await session.get('id');
    const week = (await executeQuery("SELECT date_part('week', now()) AS week")).rowsOfObjects()[0].week;
    const month =  (await executeQuery("SELECT date_part('month', now()) AS month")).rowsOfObjects()[0].month;
    data.morningW = await morningWeek(week, id);
    data.morningM = await morningMonth(month, id);
    data.eveningW = await eveningWeek(week, id);
    data.eveningM = await eveningMonth(month, id);
    data.moodW = await moodAverageWeek(week, id);
    data.moodM = await moodAverageMonth(month, id);
    data.user = await getEmail({session});

    render("summary.ejs", data);
}

const showChanged = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
    const pars = {
        week: params.get('week').substring(6),
        month: params.get('month').substring(5),
    }
    const res = await changeDate(pars, await session.get('id'));
    res.user = await getEmail({session});

    render('summary.ejs', res)
    //response.redirect('/behavior/summary');
}

export { showAverages, showChanged }