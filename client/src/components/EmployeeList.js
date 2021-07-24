import { DataGrid } from "@material-ui/data-grid";
import { useSelector } from "react-redux";
import { selectEmployees, selectPositions } from "../appReducer";

export default function EmployeeList() {
  const employees = useSelector(selectEmployees);
  const positions = useSelector(selectPositions);
  console.log(positions);

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
                editable: true,
                width: 300,
                valueOptions: positions.map((position) => position.Name),
              },
              {
                field: "IsAdmin",
                type: "boolean",
                width: 300,
                headerName: "Admin",
                editable: true,
              },
            ]}
            rows={employees || []}
          />
        </div>
      </div>
    </div>
  );
}
