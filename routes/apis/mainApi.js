import { executeQuery } from "../../database/database.js"

//api/summary
const normalSummary = async({response}) => {
    const morningStuff = (await executeQuery("SELECT AVG(duration) AS duration, AVG(quality) AS quality FROM morning WHERE date > current_date - interval '7' day")).rowsOfObjects()[0];
    const eveningStuff = (await executeQuery("SELECT AVG(sports) AS sports, AVG(study) AS study FROM evening WHERE date > current_date - interval '7' day")).rowsOfObjects()[0];
    const mood = (await executeQuery("SELECT AVG(mood) AS mood FROM (SELECT mood FROM morning WHERE date_part('week', date) = date_part('week', current_date) UNION ALL SELECT mood FROM evening WHERE date > current_date - interval '7' day) AS mood")).rowsOfObjects()[0];
    const data = {
        duration: Number(morningStuff.duration),
        quality: Number(morningStuff.quality),
        sports: Number(eveningStuff.sports),
        study: Number(eveningStuff.study),
        mood: Number(mood.mood),
    }
    response.body = data;
}

const daySummary = async({response, params}) => {
    if(params.year.length !== 4 || params.month.length !== 2 || params.day.length !== 2){
        response.body = "Invalid parameters."
        return;
    }
    const day = `${await params.year}-${await params.month}-${await params.day}`
    console.log(day)
    const morningStuff = (await executeQuery("SELECT AVG(duration) AS duration, AVG(quality) AS quality FROM morning WHERE date = $1", day)).rowsOfObjects()[0];
    const eveningStuff = (await executeQuery("SELECT AVG(sports) AS sports, AVG(study) AS study FROM evening WHERE date = $1", day)).rowsOfObjects()[0];
    const mood = (await executeQuery("SELECT AVG(mood) AS mood FROM (SELECT mood FROM morning WHERE date = '$1' UNION ALL SELECT mood FROM evening WHERE date = '$1') AS mood"), day);
    const data = {
        duration: Number(morningStuff.duration),
        quality: Number(morningStuff.quality),
        sports: Number(eveningStuff.sports),
        study: Number(eveningStuff.study),
        mood: Number(mood.mood),
    }
    response.body = data;
}

export { normalSummary, daySummary }