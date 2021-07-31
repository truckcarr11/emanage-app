import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPositions, setPositions } from "../appReducer";
import { cloneDeep, isEmpty } from "lodash";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function PositionList() {
  const dispatch = useDispatch();
  const positions = useSelector(selectPositions) || [];
  const [token] = useState(localStorage.getItem("eManageToken"));
  const [previousState, setPreviousState] = useState({});
  const [deletedRow, setDeletedRow] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [deleteParams, setDeleteParams] = useState({});

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  function onCellValueChange(value) {
    //Update with new value immediatly
    let tempPositions = cloneDeep(positions);
    tempPositions.forEach((position) => {
      if (position.id === value.id) {
        position.name = value.value;
      }
    });
    dispatch(setPositions(tempPositions));

    //Send new data to DB, revert change if not 200
    fetch(`/api/position/${value.id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: value.id,
        name: value.value,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          //Something went wrong, revent change
          if (response.status !== 401) {
            let tempPositions = cloneDeep(positions);
            tempPositions.forEach((position) => {
              if (position.id === previousState.id)
                position.name = previousState.value;
            });
            dispatch(setPositions(tempPositions));
            setAlertOpen(true);
            setAlertText("Something went wrong. Changes have been reverted.");
          } else {
            setAlertOpen(true);
            setAlertText(
              "Your session has expired. Please signout and sign back in."
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onEditCellChangeCommitted(data) {
    setPreviousState(data);
  }

  function deleteRow(params) {
    setDeletedRow(params.row);
    setDeleteParams(params);
    let tempPositions = cloneDeep(positions);
    let deleteId = tempPositions.findIndex(
      (position) => position.id === params.row.id
    );
    tempPositions.splice(deleteId, 1);
    dispatch(setPositions(tempPositions));
  }

  useEffect(() => {
    if (!isEmpty(deleteParams)) {
      fetch(`/api/position/${deleteParams.row.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            //Something went wrong, revent change
            if (response.status === 409) {
              setAlertOpen(true);
              setAlertText("Employees with that position still exist.");
              let tempPositions = cloneDeep(positions);
              tempPositions.push(deletedRow);
              dispatch(setPositions(tempPositions));
              return;
            }
            if (response.status !== 401) {
              let tempPositions = cloneDeep(positions);
              tempPositions.push(deletedRow);
              dispatch(setPositions(tempPositions));
              setAlertOpen(true);
              setAlertText("Something went wrong. Changes have been reverted.");
              return;
            } else {
              setAlertOpen(true);
              setAlertText(
                "Your session has expired. Please signout and sign back in."
              );
              return;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [deletedRow]);

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              autoHeight
              disableSelectionOnClick
              getRowId={(position) => position.id}
              columns={[
                {
                  field: "id",
                  type: "string",
                  headerName: "Position Id",
                  width: 300,
                },
                {
                  field: "name",
                  type: "string",
                  headerName: "Name",
                  width: 300,
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
              rows={[...positions].sort((a, b) => {
                return a.id - b.id;
              })}
              onCellValueChange={onCellValueChange}
              onEditCellChangeCommitted={onEditCellChangeCommitted}
            />
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {alertText}
        </Alert>
      </Snackbar>
    </>
  );
}
