package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

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
