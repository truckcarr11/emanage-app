import Header from "../components/Header";
import Button from "@material-ui/core/Button";
import EmployeeList from "../components/EmployeeList";
import { useDispatch } from "react-redux";
import { setPositions, setEmployees, setUser } from "../appReducer";
import { useEffect, useState } from "react";
import PositionList from "../components/PositionList";
import { Box, Snackbar } from "@material-ui/core";
import AddNewDialog from "../components/AddNewDialog";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Manage() {
  const dispatch = useDispatch();
  const [user] = useState(JSON.parse(localStorage.getItem("eManageUser")));
  const [token] = useState(localStorage.getItem("eManageToken"));
  const [managePage, setManagePage] = useState(
    localStorage.getItem("managePage")
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  useEffect(() => {
    if (user !== null) {
      dispatch(setUser(user));
      fetch(`/api/company/${user.companyId}/employees`, {
        headers: {
          Authorization: "Bearer " + token,
        },
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
            dispatch(setEmployees(data));
          }
        })
        .catch((error) => {
          console.log(error);
        });
      fetch(`/api/company/${user.companyId}/positions`, {
        headers: {
          Authorization: "Bearer " + token,
        },
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
          if (data !== undefined) dispatch(setPositions(data));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //User is not logged in, send them to sign in page with no back button
      //Location replace doesn't allow the use of the back button
      window.location.replace(window.location.origin + "/signin");
    }
  }, [dispatch, user, token]);

  return (
    <>
      <Header setManagePage={setManagePage} />
      <Box m={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Add new
        </Button>
      </Box>
      {managePage === "employees" ? <EmployeeList /> : <PositionList />}
      <AddNewDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        type={managePage}
      />
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
