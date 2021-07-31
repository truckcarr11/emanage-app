package main

import (
	"log"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/truckcarr11/emanage/models"
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

func GetAllEmployees(companyID int) ([]models.Employee, error) {
	rows, err := DB.Query(`SELECT e.*, p.name FROM employees e JOIN positions p on p.id = e.position_id WHERE e.company_id=$1`, companyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var employees []models.Employee
	for rows.Next() {
		var employee models.Employee
		rows.Scan(&employee.ID, &employee.PositionID, &employee.CompanyID, &employee.FirstName, &employee.LastName, &employee.PositionName)
		employees = append(employees, employee)
	}

	err = rows.Err()
	if err != nil {
		log.Println(err)
	}

	return employees, nil
}

func GetAllPositions(companyID int) ([]models.Position, error) {
	rows, err := DB.Query(`SELECT * FROM positions WHERE company_id=$1`, companyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var positions []models.Position
	for rows.Next() {
		var position models.Position
		rows.Scan(&position.ID, &position.CompanyID, &position.Name)
		positions = append(positions, position)
	}

	err = rows.Err()
	if err != nil {
		log.Println(err)
	}

	return positions, nil
}

func GenerateJWT(secret []byte, user models.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["user"] = user
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	tokenString, err := token.SignedString(secret)

	if err != nil {
		log.Println("Something Went Wrong:", err)
		return "", err
	}

	return tokenString, nil
}
