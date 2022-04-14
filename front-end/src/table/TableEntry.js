import React from "react";
import { Link } from "react-router-dom";

export default function TableEntry({ table }) {
  return (
    <tr>
      <th scope="row">{table.table_name}</th>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>{table.status}</td>
      <td>{table.assigned_to}</td>
      <td><Link><button className="btn btn-primary">Finish</button></Link></td>
    </tr>
  );
}
