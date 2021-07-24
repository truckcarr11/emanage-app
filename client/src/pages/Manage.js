import Header from "../components/Header";
import EmployeeList from "../components/EmployeeList";
import { useDispatch, useSelector } from "react-redux";
import {
  setPositions,
  setEmployees,
  setEmployee as eManageSetEmployee,
  selectManagePage,
} from "../appReducer";
import { useEffect, useState } from "react";
import PositionList from "../components/PositionList";

export default function Manage() {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("eManageEmployee"))
  );
  const managePage = useSelector(selectManagePage);

  useEffect(() => {
    if (employee !== undefined) {
      dispatch(eManageSetEmployee(employee));
      fetch(`/api/company/${employee.CompanyId}/employees`)
        .then((response) => response.json())
        .then((data) => dispatch(setEmployees(data.data)));
      fetch(`/api/company/${employee.CompanyId}/positions`)
        .then((response) => response.json())
        .then((data) => dispatch(setPositions(data.data)));
    } else {
      //User is not logged in, send them to sign in page with no back button
      //Location replace doesn't allow the use of the back button
      window.location.replace(window.location.origin + "/signin");
    }
  }, [dispatch, employee]);

  return (
    <>
      <Header />
      {managePage === "employees" ? (
        <EmployeeList isAdmin={employee.IsAdmin} />
      ) : (
        <PositionList isAdmin={employee.IsAdmin} />
      )}
    </>
  );
}
