import Header from "../components/Header";
import EmployeeList from "../components/EmployeeList";
import { useDispatch } from "react-redux";
import { setPositions, setCompanyId, setEmployees } from "../appReducer";
import { useEffect } from "react";

export default function Manage() {
  const dispatch = useDispatch();

  useEffect(() => {
    let employeeId = localStorage.getItem("eManageEmployeeId");
    if (employeeId) {
      let companyId = localStorage.getItem("eManageCompanyId");
      dispatch(setCompanyId(companyId));
      fetch(`/api/company/${companyId}/employees`)
        .then((response) => response.json())
        .then((data) => dispatch(setEmployees(data.data)));
      fetch(`/api/company/${companyId}/positions`)
        .then((response) => response.json())
        .then((data) => dispatch(setPositions(data.data)));
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <EmployeeList />
    </>
  );
}
