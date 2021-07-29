import Header from "../components/Header";
import Button from "@material-ui/core/Button";
import EmployeeList from "../components/EmployeeList";
import { useDispatch } from "react-redux";
import { setPositions, setEmployees, setUser } from "../appReducer";
import { useEffect, useState } from "react";
import PositionList from "../components/PositionList";
import { Box } from "@material-ui/core";
import AddNewDialog from "../components/AddNewDialog";

export default function Manage() {
  const dispatch = useDispatch();
  const [user] = useState(JSON.parse(localStorage.getItem("eManageUser")));
  const [token] = useState(localStorage.getItem("eManageToken"));
  const [managePage, setManagePage] = useState(
    localStorage.getItem("managePage")
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user !== null) {
      dispatch(setUser(user));
      fetch(`/api/company/${user.companyId}/employees`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data !== null) {
            dispatch(setEmployees(data));
          }
        });
      fetch(`/api/company/${user.companyId}/positions`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data !== null) dispatch(setPositions(data));
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
    </>
  );
}
