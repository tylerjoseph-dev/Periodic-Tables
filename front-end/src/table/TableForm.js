import { React, useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";

export default function TableForm({ populate }) {
    const URL = process.env.REACT_APP_API_BASE_URL + "/tables"
  const history = useHistory();
  const initialFormState = populate
    ? { ...populate }
    : {
        table_name: "",
        capacity: 1,
      };

  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    if (target.name == "capacity") {
      setFormData({
        ...formData,
        [target.name]: parseInt(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrors(null);
      await axios.post(URL, { data: formData });
      history.push(`/dashboard`);
    } catch (e) {
      setErrors(e.response.data.error);
    }
  };

  return (
    <div>
      <ErrorAlert error={errors} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            name="table_name"
            type="text"
            className="form-control"
            id="table_name"
            aria-describedby="table_name"
            placeholder="Bar #22"
            minLength={2}
            required={true}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="table_name">Capacity</label>
          <input
            name="table_capacity"
            type="number"
            className="form-control"
            id="table_capacity"
            aria-describedby="table_capacity"
            placeholder="1"
            min={1}
            max={200}
            required={true}
            onChange={handleChange}
          />
        </div>

        <button
          type="cancel"
          className="btn btn-danger"
          onClick={() => history.push("/")}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
