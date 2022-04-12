const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const service = require("./reservations.service");

async function list(req, res) {
  const { date } = req.query;
  console.log(date);
  if (date) {
    const list = await service.list(date);
    res.status(200).json({ data: list });
  }
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

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(reservation_date)) {
    if (/^([0-2]?[0-9]|1[0-3]):[0-5][0-9]$/.test(reservation_time)) {
      const date = new Date(reservation_date);
      if (date.getDay() == 1) {
        return next({
          status: 400,
          message: `reservation_date is on a closed day (tuesday).`,
        });
      }
      const hrMin = reservation_time.replace(":", "");
      if (hrMin > 1030 && hrMin < 2131) {
        const now = new Date().toLocaleString();
        const resDate = new Date(
          `${reservation_date}T${reservation_time}`
        ).toLocaleString();
        if (resDate < now) {
          return next({
            status: 400,
            message: `reservation_date and reservation_time must be in the future`,
          });
        }else{
          return next();
        }
        
      }

      return next({
        status: 400,
        message: `reservation_date or reservation_time is not during working hours.`,
      });
    }
  }
  return next({
    status: 400,
    message: `reservation_date / reservation_time is not correct.`,
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
  await service.create(newReservation);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  list,
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("people"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    asyncErrorBoundary(dateTimeIsValid),
    asyncErrorBoundary(peopleIsValid),
    asyncErrorBoundary(create),
  ],
};
