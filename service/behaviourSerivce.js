import { executeQuery } from "../database/database.js"
import { validate, required, isNumber, numberBetween, minNumber, isDate } from "../deps.js"
import { getToday } from "../routes/controller/behaviourController.js"

const addMorning = async(params) => {

  const validationRules = {
    date: [required, isDate],
    duration: [required, isNumber, minNumber(0)],
    quality: [required, isNumber, numberBetween(1, 5)],
    mood: [required, isNumber, numberBetween(1, 5)]
  }

    const [passes, errors] = await validate(params, validationRules);
  
    if(passes){
      //Delete a morning for the same day if exists
      await executeQuery("DELETE FROM morning WHERE date = $1 AND user_id = $2", params.date, params.user_id);
      await executeQuery(`INSERT INTO morning (date, duration, quality, mood, user_id) VALUES ($1, $2, $3, $4, $5)`,
      params.date,
      params.duration,
      params.quality,
      params.mood,
      params.user_id);
      const data = {
        date: await getToday(),
        quality: '',
        duration: '',
        mood: '',
        errors: null,
      };
      return data;
    } else {
      params.errors = errors;
      return params;
    }
}

const addEvening = async(params) => {
  const validationRules = {
    date: [required, isDate],
    sports: [required, minNumber(0)],
    study: [required, minNumber(0)],
    eating: [required, numberBetween(1, 5)],
    mood: [required, numberBetween(1, 5)]
  }
  const [passes, errors] = await validate(params, validationRules);

  if(passes){
    await executeQuery("DELETE FROM evening WHERE date = $1 AND user_id = $2", params.date, params.user_id);
    await executeQuery("INSERT INTO evening (date, sports, study, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
    params.date,
    params.sports,
    params.study,
    params.eating,
    params.mood,
    params.user_id);

    const data = {
      date: await getToday(),
      sports: '',
      study: '',
      eating: '',
      mood:'',
      user_id: params.user_id,
      errors: null,
    };
    return data;
  } else {
    params.errors = errors;
    return params
  }
}

const reportStatus = async(id) => {
  const morning = await executeQuery("SELECT * FROM morning WHERE date_part('day', date) = date_part('day', current_date) AND user_id = $1", id);
  const evening = await executeQuery("SELECT * FROM evening WHERE date_part('day', date) = date_part('day', current_date) AND user_id = $1", id);
  const data = {
    morningM: 'Data for morning has not yet been submitted',
    eveningM: 'Data for evening has not yet been submitted',
  }

  if(morning.rowCount > 0){
    data.morningM = "Data for morning has already been submitted!"
  }
  if(evening.rowCount > 0){
    data.eveningM = "Data for evening has already been submitted!"
  }

  return data;
}

/*CREATE TABLE morning (
id SERIAL PRIMARY KEY,
date Date,
duration DECIMAL(2,1) NOT NULL,
quality INTEGER NOT NULL,
mood INTEGER NOT NULL,
user_id INTEGER REFERENCES users(id)
);*/ //Morning table

/* 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);*/

/*CREATE TABLE evening (
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
sports DECIMAL(3,1) NOT NULL,
study DECIMAL(3,1) NOT NULL,
eating INTEGER NOT NULL,
mood INTEGER NOT NULL,
user_id INTEGER REFERENCES users(id)
); */

export { addMorning, addEvening, reportStatus }