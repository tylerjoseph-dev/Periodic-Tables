import React from "react";

export default function ReservationEntry({ reservation }) {
  return (
    <tr>
      <th scope="row">{reservation.first_name}</th>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
    </tr>
  );
}
