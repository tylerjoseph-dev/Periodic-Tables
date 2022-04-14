import React from "react";
import TableEntry from "./TableEntry";

export default function TablesTable({ tables }) {
    console.log(tables)
    const list = tables.map((table) => <TableEntry table={table}/>);
    

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Occupied By</th>
            <th scope="col">Manage</th>
          </tr>
        </thead>
        <tbody>
            {list}
        </tbody>
      </table>
    </div>
  );
}