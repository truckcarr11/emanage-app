package helpers

import (
	"database/sql"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GetAllPositions(companyID int, db *sql.DB) ([]Position, error) {
	rows, err := db.Query(`SELECT * FROM positions WHERE company_id=$1`, companyID)
	if err != nil {
		return nil, err
	}

	var positions []Position
	for rows.Next() {
		var position Position
		rows.Scan(&position.Id, &position.CompanyId, &position.Name)
		positions = append(positions, position)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
	}

	return positions, nil
}
