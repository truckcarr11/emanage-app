import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectEmployees, selectPositions } from "../appReducer";

export default function EmployeeList(props) {
  const positions = useSelector(selectPositions);
  const employeesTemp = useSelector(selectEmployees);
  const [employees, setEmployees] = useState(employeesTemp);

  useEffect(() => {
    setEmployees(employeesTemp);
  }, [employeesTemp]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            autoHeight
            disableSelectionOnClick
            getRowId={(employee) => employee.Id}
            columns={[
              {
                field: "Id",
                type: "string",
                headerName: "Employee Id",
                width: 300,
              },
              {
                field: "FirstName",
                type: "string",
                headerName: "First Name",
                width: 300,
                editable: true,
              },
              {
                field: "LastName",
                type: "string",
                headerName: "Last Name",
                width: 300,
                editable: true,
              },
              {
                field: "PositionName",
                headerName: "Position",
                type: "singleSelect",
                width: 300,
                valueOptions: positions.map((position) => position.Name),
                editable: true,
              },
            ]}
            rows={employees}
          />
        </div>
      </div>
    </div>
  );
}
