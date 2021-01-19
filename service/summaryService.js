import { executeQuery } from "../database/database.js"

const morningWeek = async(week, id) => {
    const res = (await executeQuery("SELECT AVG(duration) AS duration, AVG(quality) AS quality, AVG(mood) AS mood FROM morning WHERE user_id = $1 AND date_part('week', date) = $2", id, week))//.rowsOfObjects()[0];
    if((await executeQuery("SELECT * FROM morning WHERE user_id = $1 AND date_part('week', date) = $2", id, week)).rowCount === 0){
        const data = {
            passed: false,
        }
        return data;
    } else {
        const objs = res.rowsOfObjects()[0];
    const data = {
        wduration: Number(objs.duration),
        wquality: Number(objs.quality),
        wmood: Number(objs.mood),
        passed: true,
    }
    return data;
    }
}

const morningMonth = async(month, id) => {
    const res = (await executeQuery("SELECT AVG(duration) AS duration, AVG(quality) AS quality, AVG(mood) AS mood FROM morning WHERE user_id = $1 AND date_part('month', date) = $2", id, month));//.rowsOfObjects()[0];
    if((await executeQuery("SELECT * FROM morning WHERE user_id = $1 AND date_part('month', date) = $2", id, month)).rowCount === 0){
        const data = {
            passed: false,
        }
        return data;
    } else {
        const objs = res.rowsOfObjects()[0];
        const data = {
            mduration: Number(objs.duration),
            mquality: Number(objs.quality),
            mmood: Number(objs.mood),
            passed: true,
        }

    return data;
    }
}

const eveningWeek = async(week, id) => {
    const res = (await executeQuery("SELECT AVG(sports) AS sports, AVG(study) AS study, AVG(eating) AS eating, AVG(mood) AS mood FROM evening WHERE user_id = $1 AND date_part('week', date) = $2", id, week))//.rowsOfObjects()[0];
    if((await executeQuery("SELECT * FROM evening WHERE user_id = $1 AND date_part('week', date) = $2", id, week)).rowCount === 0){
        const data = {
            passed: false,
        }
        return data;
    } else {
        const objs = res.rowsOfObjects()[0];
     const data = {
        wsports: Number(objs.sports),
        wstudy: Number(objs.study),
        weating: Number(objs.eating),
        wmood: Number(objs.mood), 
        passed: true,
    }
    return data;
    }
}

const eveningMonth = async(month, id) => {
    const res = (await executeQuery("SELECT AVG(sports) AS sports, AVG(study) AS study, AVG(eating) AS eating, AVG(mood) AS mood FROM evening WHERE user_id = $1 AND date_part('month', date) = $2", id, month))//.rowsOfObjects()[0];
    if((await executeQuery("SELECT * FROM evening WHERE user_id = $1 AND date_part('month', date) = $2", id, month)).rowCount === 0){
        const data = {
            passed: false,
        }
        return data;
    } else {
        const objs = res.rowsOfObjects()[0];
        const data = {
            msports: Number(objs.sports),
            mstudy: Number(objs.study),
            meating: Number(objs.eating),
            mmood: Number(objs.mood),
            passed: true,
        }
       return data;
    }
}

const moodAverageWeek = async(week, id) => {
    const res = await(executeQuery("SELECT AVG(mood) FROM (SELECT mood FROM morning WHERE date_part('week', date) = $2 AND user_id = $1 UNION ALL SELECT mood FROM evening WHERE date_part('week', date) = $2 AND user_id = $1) AS mood", id, week))
    const data = {
        moodW: Number(res.rowsOfObjects()[0].avg)
    }
    return data;
}

const moodAverageMonth = async(month, id) => {
    const res = await(executeQuery("SELECT AVG(mood) FROM (SELECT mood FROM morning WHERE date_part('month', date) = $2 AND user_id = $1 UNION ALL SELECT mood FROM evening WHERE date_part('month', date) = $2 AND user_id = $1) AS mood", id, month));
    const data = {
        moodM: Number(res.rowsOfObjects()[0].avg),
    }
    return data;
}

const changeDate = async(params, id) => {
    const week = params.week;
    const month = params.month;

    const data = {
        morningW: await morningWeek(week, id),
        morningM: await morningMonth(month, id),
        eveningW: await eveningWeek(week, id),
        eveningM: await eveningMonth(month, id),
        moodW: await moodAverageWeek(week, id),
        moodM: await moodAverageMonth(month, id),
    }
    
    return data;
}
export { morningWeek, eveningWeek, morningMonth, eveningMonth,changeDate, moodAverageWeek, moodAverageMonth }