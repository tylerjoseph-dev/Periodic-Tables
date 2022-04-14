const knex = require("../db/connection");

async function list(){
    return knex("tables as t")
    .select("*")
    .orderBy("table_name");
}
async function read(tableId){
    return knex("tables as t")
        .select("*")
        .where({"table_id": tableId}).first();
}
async function create(table){
    return knex("tables as t")
    .insert(table);
}

async function seatTable(table, reservation_id){
    return knex("tables as t")
        .where({"table_id": table})
        .update({"assigned_to": reservation_id, "status": "occupied"});
}

module.exports = {
    list,
    create,
    read,
    seatTable,
}