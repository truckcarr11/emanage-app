import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPositions,
  selectUser,
  setEmployees,
  setPositions,
} from "../appReducer";
import { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  const positions = useSelector(selectPositions) || [];
  const user = useSelector(selectUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [positionId, setPositionId] = useState("");
  const [positionName, setPositionName] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");

  function handleAdd() {
    if (props.type === "employees") addNewEmployee();
    else addNewPosition();
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  function addNewEmployee() {
    fetch("/api/employee/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        positionId,
        companyId: user.companyId,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          setAlertOpen(true);
          setAlertText(
            "Your session has expired. Please signout and sign back in."
          );
          return;
        } else if (response.status === 200) return response.json();
        else {
          setAlertOpen(true);
          setAlertText("Something went wrong. Try again later.");
          return;
        }
      })
      .then((data) => {
        if (data !== undefined) {
          dispatch(setEmployees(data));
          props.setOpen(false);
          setFirstName("");
          setLastName("");
          setPositionId("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
      .then((response) => {
        if (response.status === 401) {
          setAlertOpen(true);
          setAlertText(
            "Your session has expired. Please signout and sign back in."
          );
          return;
        } else if (response.status === 200) return response.json();
        else {
          setAlertOpen(true);
          setAlertText("Something went wrong. Try again later.");
        }
      })
      .then((data) => {
        if (data !== undefined) {
          dispatch(setPositions(data));
          props.setOpen(false);
          setPositionName("");
        }
      })
      .catch((error) => {
        console.log(error);
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
                      {position.name}
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
