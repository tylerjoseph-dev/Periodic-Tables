const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");



async function list(req, res) {
    const list = await service.list();
    res.status(200).json({ data: list });
}

async function reservationExists(req, res, next){
  const found = await reservationsService.read(req.body.data.reservation_id)
  if(found){
    res.locals.reservation = found;
    return next();
  }
  next({status:404, message:`Reservation not found ${req.body.data.reservation_id}!`});
}


async function tableExists(req, res, next){
  const tableId = req.params.table_id;
  const found = await service.read(tableId);
  if(found){
    res.locals.table = found;
    console.log(`Passed Table Exists`)
    return next();
  }
  return next({status: 404, message: `table not found with id:${req.params.table_id}`});
}

async function read(req, res, next){
  res.status(200).json({data: res.locals.table});
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({
        status: 400,
        message: `New table must include a ${propertyName}.`,
      });
    };
}

function tableNameIsValid(req, res, next) {
  const { data: { table_name } = {} } = req.body;

  if (table_name.length > 1) {
    return next();
  }

  return next({
    status: 400,
    message: `table_name must be at least 2 characters.`,
  });
}

function tableCapacityIsValid(req, res, next) {
  const { data: { capacity } = {} } = req.body;

  if (typeof capacity === "number" && capacity > 0) {
    return next();
  }
  return next({ status: 400, message: `table capacity must be at least 1.` });
}

async function create(req, res, next) {
  const { data: { table_name, capacity } = {} } = req.body;
  const newTable = {
    table_name,
    capacity,
  };
  await service.create(newTable)
  res.status(201).json({ data: newTable });
}

function tableHasCapacity(req, res, next){
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  if(table.capacity < reservation.people){
    return next({status:400, message: `Table does not have capacity for this reservation.`});
  }
  console.log(`Passed Table Has Capacity`)
  return next();
}

function tableIsNotOccupied(req, res, next){
  const table = res.locals.table;
  console.log(table)
  if(table.status == "Free"){
    console.log("Table status is free");
    return next();
  }
  console.log("table status is not free")
  return next({status:400, message:`Table is occupied by another party`});
}

async function seat(req, res, next){
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  const seated = await service.seatTable(table.table_id, reservation.reservation_id);
  console.log(seated)
  res.status(200).json({data:{seated}});
}

module.exports = {
  list,

  create: [
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    tableNameIsValid,
    tableCapacityIsValid,
    create,
  ],

  read:[
    tableExists,
    read,
  ],

  seat: [
    bodyDataHas("reservation_id"),
    
    asyncErrorBoundary(reservationExists),
  
    asyncErrorBoundary(tableExists),
    
    tableHasCapacity,
    
    tableIsNotOccupied,
    
    asyncErrorBoundary(seat),
  ],
};
