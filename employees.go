package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/truckcarr11/emanage/models"
)

func CreateEmployee(w http.ResponseWriter, r *http.Request) {
	var createEmployeeInput models.CreateEmployeeInput
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	json.Unmarshal(reqBody, &createEmployeeInput)

	_, err = DB.Query(`INSERT INTO employees (first_name, last_name, position_id, company_id) VALUES($1, $2, $3, $4)`,
		createEmployeeInput.FirstName, createEmployeeInput.LastName, createEmployeeInput.PositionID, createEmployeeInput.CompanyID)
	if err != nil {
		log.Println("err:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	positions, err := GetAllEmployees(createEmployeeInput.CompanyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(positions)
}

func UpdateEmployee(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	employeeID := vars["employeeID"]

	var updateEmployeeInput models.UpdateEmployeeInput
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println("err:", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.Unmarshal(reqBody, &updateEmployeeInput)

	_, err = DB.Exec(`UPDATE employees SET first_name=$1, last_name=$2, position_id=$3 WHERE employees.id=$4`,
		updateEmployeeInput.FirstName, updateEmployeeInput.LastName, updateEmployeeInput.PositionID, employeeID)
	if err != nil {
		log.Println("err:", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteEmployee(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	employeeID := vars["employeeID"]

	_, err := DB.Exec(`DELETE FROM employees where employees.id=$1`, employeeID)
	if err != nil {
		log.Println("err:", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
