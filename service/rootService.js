import { executeQuery } from "../database/database.js"

const root = async() => {
    const today =  await executeQuery("SELECT AVG(mood) FROM (SELECT mood FROM morning WHERE date_part('day', date) = date_part('day', current_date) UNION ALL SELECT mood FROM evening WHERE date_part('day', date) = date_part('day', current_date)) AS mood");
    const yesterday = await executeQuery("SELECT AVG(mood) FROM (SELECT mood FROM morning WHERE date_part('day', date) = date_part('day', current_date - integer '1') UNION ALL SELECT mood FROM evening WHERE date_part('day', date) = date_part('day', current_date - integer '1')) AS mood");
    const data = {
        today: '',
        yesterday: '',
    };
    let message = '';
    if(today.rowCount > 0 && yesterday.rowCount > 0){
        if(today.rowsOfObjects()[0].avg >= yesterday.rowsOfObjects()[0].avg){
            message = "Things are looking bright!"
        } else {
            message = "Things are looking a bit gloomy."
        }
        data.message = message;
        data.today = Number(today.rowsOfObjects()[0].avg);
        data.yesterday = Number(yesterday.rowsOfObjects()[0].avg); //Show moods only if they exist
    }
    return data;
}
export { root }
/* SELECT AVG(mood)
FROM(SELECT mood FROM morning WHERE date_part('day', date) = date_part('day', now()) AND user_id = 1
UNION ALL
SELECT mood FROM evening WHERE date_part('day', date) = date_part('day', now()) AND user_id = 1 ) AS mood*/