import React from "react";
import ReservationEntry from "./ReservationEntry";

export default function ReservationTable({ reservations }) {
    const list = reservations.map((reservation) => <ReservationEntry reservation={reservation}/>);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Mobile</th>
            <th scope="col">Time</th>
            <th scope="col">Guests</th>
            <th scope="col">Status</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
            {list}
        </tbody>
      </table>
      {list.length < 1 &&(<h2>No reservations found</h2>)}
    </div>
  );
}
