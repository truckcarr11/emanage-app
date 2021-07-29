import { DataGrid } from "@material-ui/data-grid";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPositions } from "../appReducer";

export default function PositionList(props) {
  const positionsTemp = useSelector(selectPositions);
  const [positions, setPositions] = useState(positionsTemp);

  useEffect(() => {
    setPositions(positionsTemp);
  }, [positionsTemp]);

  const handleEditCellChangeCommitted = useCallback((data) => {
    console.log(data);
  }, []);

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
            onEditCellChangeCommitted={handleEditCellChangeCommitted}
          />
        </div>
      </div>
    </div>
  );
}
