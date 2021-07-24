import { DataGrid } from "@material-ui/data-grid";
import { useSelector } from "react-redux";
import { selectEmployees, selectPositions } from "../appReducer";

export default function EmployeeList(props) {
  const employees = useSelector(selectEmployees);
  const positions = useSelector(selectPositions);

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
                editable: props.isAdmin,
              },
              {
                field: "LastName",
                type: "string",
                headerName: "Last Name",
                width: 300,
                editable: props.isAdmin,
              },
              {
                field: "PositionName",
                headerName: "Position",
                type: "singleSelect",
                editable: props.isAdmin,
                width: 300,
                valueOptions: positions.map((position) => position.Name),
              },
              {
                field: "IsAdmin",
                type: "boolean",
                width: 300,
                headerName: "Admin",
                editable: props.isAdmin,
              },
            ]}
            rows={employees || []}
          />
        </div>
      </div>
    </div>
  );
}
