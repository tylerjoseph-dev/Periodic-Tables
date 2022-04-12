const knex = require("../db/connection");

async function list(date){
    return knex("reservations as r")
        .select("*")
        .where("reservation_date", "=", date)
        .orderBy("reservation_time");
    
}

async function create(reservation){
    return knex("reservations")
        .insert(reservation);
}

module.exports = {
    list,
    create,
}