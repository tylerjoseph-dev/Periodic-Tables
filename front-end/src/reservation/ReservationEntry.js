import React from "react";
import { Link } from "react-router-dom";

export default function ReservationEntry({ reservation }) {
  return (
    <tr>
      <th scope="row">{reservation.first_name}</th>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          <button className="btn btn-success">Seat</button>
        </Link>
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          <button className="btn btn-primary">Edit</button>
        </Link>
        <Link to={`/reservations/${reservation.reservation_id}/seat`}>
          <button className="btn btn-danger">Cancel</button>
        </Link>
      </td>
    </tr>
  );
}
