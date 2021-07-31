package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/truckcarr11/emanage/models"
)

func CreatePosition(w http.ResponseWriter, r *http.Request) {
	var createPositionInput models.CreatePositionInput
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	json.Unmarshal(reqBody, &createPositionInput)

	_, err = DB.Query(`INSERT INTO positions (name, company_id) VALUES($1, $2)`, createPositionInput.Name, createPositionInput.CompanyID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	positions, err := GetAllPositions(createPositionInput.CompanyID, DB)
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
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	json.Unmarshal(reqBody, &updatePositionInput)

	_, err = DB.Query(`UPDATE positions SET name=$1 WHERE positions.id=$2`, updatePositionInput.Name, positionID)
	if err != nil {
		log.Println("err:", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
