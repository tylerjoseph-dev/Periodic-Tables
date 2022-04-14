const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

async function list(req, res) {
  const { date } = req.query;
  if (date) {
    const list = await service.list(date);
    res.status(200).json({ data: list });
  }else{
    const list = await service.list();
    res.status(200).json({data: list});
  }
}

async function reservationExists(req, res, next){
  const reservationId = req.params.reservation_id;
  const found = await service.read(reservationId);
  console.log(found)
  if(found.people){
    res.locals.reservation = found;
    return next();
  }
  next({status: 404, message: `Reservation not found with id:${reservationId}`});
}

function read(req, res, next){
  res.status(200).json({data: res.locals.reservation});
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `New reservation must include a ${propertyName}.`,
    });
  };
}

function dateTimeIsValid(req, res, next) {
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  const dateFormat = /^\d{4}-\d{1,2}-\d{1,2}$/;
  const timeFormat = /^([0-2]?[0-9]|1[0-3]):[0-5][0-9]$/;

  if (dateFormat.test(reservation_date) && timeFormat.test(reservation_time)) {
    return next();
  }
  return next({
    status: 400,
    message: `reservation_date / reservation_time is not correct.`,
  });
}

function dateIsFuture(req, res, next){
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  const now = new Date();
  const resDate = new Date(`${reservation_date}T${reservation_time}`);
  if (resDate < now) {

    return next({
      status: 400,
      message: `reservation_date and reservation_time must be in the future`,
    });

  }else{
    return next();
  }
}

function dateisWorkingDay(req, res, next){
  const { data: { reservation_date} = {} } = req.body;
  const date = new Date(reservation_date);

      if (date.getDay() == 1) {
        return next({
          status: 400,
          message: `reservation_date is on a closed day (tuesday).`,
        });
      }else{
        return next();
      }
}

function timeIsDuringWorkingHours(req, res, next){
  const { data: { reservation_time} = {} } = req.body;

  const hrMin = reservation_time.replace(":", "");

  if (hrMin > 1030 && hrMin < 2131) {
    return next();
  }

  return next({
    status: 400,
    message: `reservation_date or reservation_time is not during working hours.`,
  });
}

function peopleIsValid(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (typeof people === "number") {
    return next();
  }

  return next({ status: 400, message: `people must be a number!` });
}

async function create(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
    } = {},
  } = req.body;
  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
  };
  const response = await service.create(newReservation);
  res.status(201).json({ data: response });
}

module.exports = {
  list,
  reservationExists,
  
  read: [
    reservationExists,
    read
  ],
  bodyDataHas,
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("people"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    asyncErrorBoundary(peopleIsValid),
    asyncErrorBoundary(dateTimeIsValid),
    asyncErrorBoundary(dateIsFuture),
    asyncErrorBoundary(dateisWorkingDay),
    asyncErrorBoundary(timeIsDuringWorkingHours),
    asyncErrorBoundary(create),
  ],
};
