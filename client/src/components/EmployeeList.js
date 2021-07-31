import { DataGrid } from "@material-ui/data-grid";
import { useSelector } from "react-redux";
import { selectEmployees, selectPositions } from "../appReducer";

export default function EmployeeList() {
  const positions = useSelector(selectPositions);
  const employees = useSelector(selectEmployees);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            autoHeight
            disableSelectionOnClick
            getRowId={(employee) => employee.id}
            columns={[
              {
                field: "id",
                type: "string",
                headerName: "Employee Id",
                width: 300,
              },
              {
                field: "firstName",
                type: "string",
                headerName: "First Name",
                width: 300,
                editable: true,
              },
              {
                field: "lastName",
                type: "string",
                headerName: "Last Name",
                width: 300,
                editable: true,
              },
              {
                field: "positionName",
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
