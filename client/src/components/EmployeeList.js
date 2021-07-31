import { DataGrid } from "@material-ui/data-grid";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEmployees, selectPositions, setEmployees } from "../appReducer";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

export default function EmployeeList() {
  const dispatch = useDispatch();
  const positions = useSelector(selectPositions);
  const employees = useSelector(selectEmployees);
  const [token] = useState(localStorage.getItem("eManageToken"));
  const [previousState, setPreviousState] = useState({});
  const [deletedRow, setDeletedRow] = useState({});

  function onEditCellChangeCommitted(data) {
    setPreviousState(data);
  }

  function onCellValueChange(value) {
    //Update with new value immediatly
    let tempEmployees = cloneDeep(employees);
    let updatedEmployee = {};
    tempEmployees.forEach((employee) => {
      if (employee.id === value.id) {
        employee[value.field] = value.value;
        if (value.field === "positionId") {
          let newPosition = positions.find(
            (position) => position.id === value.value
          );
          employee.positionName = newPosition.name;
        }
        updatedEmployee = employee;
      }
    });
    dispatch(setEmployees(tempEmployees));
    //Send new data to DB, revert change if not 200
    fetch(`/api/employee/${value.id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: updatedEmployee.id,
        firstName: updatedEmployee.firstName,
        lastName: updatedEmployee.lastName,
        positionId: updatedEmployee.positionId,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          //Something went wrong, revent change
          let tempEmployees = cloneDeep(employees);
          tempEmployees.forEach((employee) => {
            if (employee.id === previousState.id)
              employee[previousState.field] = previousState.value;
          });
          dispatch(setEmployees(tempEmployees));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteRow(params) {
    setDeletedRow(params.row);
    let tempEmployees = cloneDeep(employees);
    let deleteId = tempEmployees.findIndex(
      (employee) => employee.id === params.row.id
    );
    tempEmployees.splice(deleteId, 1);
    dispatch(setEmployees(tempEmployees));

    fetch(`/api/employee/${params.row.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          //Something went wrong, revent change
          let tempEmployees = cloneDeep(employees);
          tempEmployees.push(deletedRow);
          dispatch(setEmployees(tempEmployees));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getPositionName(params) {
    return params.row.positionName;
  }

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
                field: "positionId",
                headerName: "Position",
                type: "singleSelect",
                width: 300,
                valueGetter: getPositionName,
                valueOptions: positions.map((position) => {
                  return { label: position.name, value: position.id };
                }),
                editable: true,
              },
              {
                field: "",
                align: "center",
                disableColumnMenu: true,
                hideSortIcons: true,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                  return (
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      onClick={() => deleteRow(params)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  );
                },
              },
            ]}
            onCellValueChange={onCellValueChange}
            onEditCellChangeCommitted={onEditCellChangeCommitted}
            rows={employees}
          />
        </div>
      </div>
    </div>
  );
}
