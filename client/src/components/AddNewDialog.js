import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { selectPositions, selectUser, setPositions } from "../appReducer";
import { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function AddNewDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [token] = useState(localStorage.getItem("eManageToken"));
  const positions = useSelector(selectPositions);
  const user = useSelector(selectUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [positionId, setPositionId] = useState(null);
  const [positionName, setPositionName] = useState("");

  function handleAdd() {
    if (props.type === "employees") addNewEmployee();
    else addNewPosition();
  }

  function addNewEmployee() {}

  function addNewPosition() {
    fetch("/api/position/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: positionName,
        companyId: user.companyId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== null) {
          dispatch(setPositions(data));
          props.setOpen(false);
        }
      });
  }

  return (
    <>
      <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {props.type === "employees" ? "Add new employee" : "Add new position"}
        </DialogTitle>
        <DialogContent style={{ overflowY: "visible" }}>
          {props.type === "employees" ? (
            <>
              <TextField
                required={true}
                margin="dense"
                id="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                required={true}
                margin="dense"
                id="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <FormControl required className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Position</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  autoWidth
                >
                  {positions.map((position) => (
                    <MenuItem value={position.id} key={position.id}>
                      {position.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <TextField
              required={true}
              margin="dense"
              id="name"
              label="Position Name"
              variant="outlined"
              fullWidth
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
