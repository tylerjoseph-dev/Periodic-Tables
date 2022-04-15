const knex = require("../db/connection");

async function list(date){
    if(date){
        return knex("reservations as r")
        .select("*")
        .where("reservation_date", "=", date)
        .whereNot({"status": "finished"})
        .orderBy("reservation_time");
    
    }else{
        return knex("reservations as r")
        .select("*")
        .whereNot({"status": "finished"})
        .orderBy("reservation_date");
    }
    
}

async function read(reservation_id){
    return knex("reservations as r")
        .select("*")
        .where({reservation_id})
        .first();
}

async function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*").then((createdRecord) => createdRecord[0]);
}

async function setStatus(status, reservation_id){
    return knex("reservations as r")
        .where({"reservation_id": reservation_id})
        .update({"status": status})
        .returning("*").then((createdRecord => createdRecord[0]));
}


module.exports = {
    list,
    create,
    read,
    setStatus,
}