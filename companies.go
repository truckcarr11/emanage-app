package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func GetCompanyEmployees(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	companyID := vars["companyID"]
	intCompanyId, err := strconv.Atoi(companyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	employees, err := GetAllEmployees(intCompanyId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
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
		return
	}

	positions, err := GetAllPositions(intCompanyId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(positions)
}
