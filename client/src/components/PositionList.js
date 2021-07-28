import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPositions } from "../appReducer";

export default function PositionList(props) {
  const positionsTemp = useSelector(selectPositions);
  const [positions, setPositions] = useState(positionsTemp);

  useEffect(() => {
    setPositions(positionsTemp);
  }, [positionsTemp]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            autoHeight
            disableSelectionOnClick
            getRowId={(position) => position.Id}
            columns={[
              {
                field: "Id",
                type: "string",
                headerName: "Position Id",
                width: 300,
              },
              {
                field: "Name",
                type: "string",
                headerName: "Name",
                width: 300,
                editable: true,
              },
            ]}
            rows={[...positions].sort((a, b) => {
              return a.Id - b.Id;
            })}
          />
        </div>
      </div>
    </div>
  );
}
