package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/truckcarr11/emanage/models"
)

func GetCompanyEmployees(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	companyID := vars["companyID"]

	rows, err := DB.Query(`SELECT employees.id, p.id as position_id, p.name as position_name, first_name, 
  last_name FROM employees JOIN positions p ON p.id = employees.position_id WHERE employees.company_id=$1`, companyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer rows.Close()

	var employees []models.Employee
	for rows.Next() {
		var employee models.Employee
		rows.Scan(&employee.ID, &employee.PositionID, &employee.PositionName, &employee.FirstName, &employee.LastName)
		employees = append(employees, employee)
	}

	err = rows.Err()
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(employees)
}

func GetCompanyPositions(w http.ResponseWriter, r *http.Request) {
	//claims := r.Context().Value("claims").(jwt.MapClaims)
	vars := mux.Vars(r)
	companyID := vars["companyID"]
	intCompanyId, err := strconv.Atoi(companyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	positions, err := GetAllPositions(intCompanyId, DB)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(positions)
}
