package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/truckcarr11/emanage/models"
)

func CreatePosition(w http.ResponseWriter, r *http.Request) {
	var createPositionInput models.CreatePositionInput
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.Unmarshal(reqBody, &createPositionInput)

	_, err = DB.Exec(`INSERT INTO positions (name, company_id) VALUES($1, $2)`, createPositionInput.Name, createPositionInput.CompanyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	positions, err := GetAllPositions(createPositionInput.CompanyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(positions)
}

func UpdatePosition(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	positionID := vars["positionID"]

	var updatePositionInput models.UpdatePositionInput
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println("err:", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.Unmarshal(reqBody, &updatePositionInput)

	_, err = DB.Exec(`UPDATE positions SET name=$1 WHERE positions.id=$2`, updatePositionInput.Name, positionID)
	if err != nil {
		log.Println("err:", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeletePosition(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	positionID := vars["positionID"]

	_, err := DB.Exec(`DELETE FROM positions where positions.id=$1`, positionID)
	if err != nil {
		log.Println("err:", err)
		if strings.Contains(err.Error(), "violates foreign key constraint") {
			http.Error(w, "Employees with that position still exist.", http.StatusConflict)
			return
		}
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
