import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ReservationForm from "./ReservationForm"
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateReservation(){
    return (
        <div>
            <h1>Create Reservation</h1>
            <ReservationForm/>
        </div>
    )
}

