import { DataGrid } from "@material-ui/data-grid";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPositions, setPositions } from "../appReducer";
import { cloneDeep } from "lodash";

export default function PositionList() {
  const dispatch = useDispatch();
  const positions = useSelector(selectPositions);
  const [token] = useState(localStorage.getItem("eManageToken"));
  const [previousState, setPreviousState] = useState({});

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
          let tempPositions = cloneDeep(positions);
          tempPositions.forEach((position) => {
            if (position.id === previousState.id)
              position.name = previousState.value;
          });
          dispatch(setPositions(tempPositions));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onEditCellChangeCommitted(data) {
    setPreviousState(data);
  }

  return (
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
  );
}
