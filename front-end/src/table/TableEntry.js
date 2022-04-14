import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";
export default function TableEntry({ table }) {
  const URL = process.env.REACT_APP_API_BASE_URL;
  const history = useHistory();

  const handleClick = async (event) => {
    try{
      const confirmed = window.confirm('Is this table ready to seat new guests? This cannot be undone.');

      console.log(confirmed);
      if(confirmed){
        await axios.delete(`${URL}/tables/${table.table_id}/seat`);
        history.go(0);
      }
    }catch(error){

    }
  }


  return (
    <tr>
      <th scope="row">{table.table_name}</th>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}><span>{table.status}</span></td>
      <td>{table.assigned_to}</td>
      {table.status == "occupied" &&(
        <td><button data-table-id-finish={table.table_id} className="btn btn-primary" onClick={handleClick}>Finish</button></td>
      )}
    </tr>
  );
}
