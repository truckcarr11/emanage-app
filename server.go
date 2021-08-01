package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/truckcarr11/emanage/models"
)

var DB *sql.DB
var JWT_SECRET []byte

func IsAuthorized(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header["Authorization"] != nil {

			var claims jwt.MapClaims

			token, err := jwt.ParseWithClaims(strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer "), &claims, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("there was an error")
				}
				return JWT_SECRET, nil
			})

			if err != nil {
				log.Println("err:", err)
				http.Error(w, err.Error(), http.StatusUnauthorized)
			}
			//log.Println("claims:", claims)
			if token.Valid {
				handler.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), "claims", claims)))
			}
		} else {

			http.Error(w, "Not authorized", http.StatusUnauthorized)
		}
	})
}

func main() {
	DATABASE_URL, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		log.Fatalln("Database url does not exist")
	}
	SECRET, ok := os.LookupEnv("JWT_SECRET")
	if !ok {
		log.Fatalln("JWT secret does not exist")
	}
	JWT_SECRET = []byte(SECRET)

	db, err := sql.Open("postgres", DATABASE_URL)
	if err != nil {
		log.Fatal(err)
	}
	DB = db

	//Set up routers
	router := mux.NewRouter().StrictSlash(true)
	nonAuth := router.PathPrefix("/api").Subrouter()
	api := router.PathPrefix("/api").Subrouter()
	api.Use(IsAuthorized)
	companyRouter := api.PathPrefix("/company").Subrouter()
	positionRouter := api.PathPrefix("/position").Subrouter()
	employeeRouter := api.PathPrefix("/employee").Subrouter()

	//Serve the index.html page for the base route
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))

	//Set up the company routes
	companyRouter.HandleFunc("/{companyID}/employees", GetCompanyEmployees).Methods("GET")
	companyRouter.HandleFunc("/{companyID}/positions", GetCompanyPositions).Methods("GET")

	//Set up the position router
	positionRouter.HandleFunc("/", CreatePosition).Methods("POST")
	positionRouter.HandleFunc("/{positionID}", UpdatePosition).Methods("PUT")
	positionRouter.HandleFunc("/{positionID}", DeletePosition).Methods("DELETE")

	//Set up employee router
	employeeRouter.HandleFunc("/", CreateEmployee).Methods("POST")
	employeeRouter.HandleFunc("/{employeeID}", UpdateEmployee).Methods("PUT")
	employeeRouter.HandleFunc("/{employeeID}", DeleteEmployee).Methods("DELETE")

	nonAuth.HandleFunc("/signin", func(w http.ResponseWriter, r *http.Request) {
		var loginInput models.LoginInput
		reqBody, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		json.Unmarshal(reqBody, &loginInput)

		var user models.User

		err = db.QueryRow(`SELECT u.username, u.password, u.company_id, c.name FROM users u JOIN companies c ON c.id=u.company_id WHERE u.username=$1`,
			loginInput.Username).Scan(&user.Username, &user.Password, &user.CompanyID, &user.CompanyName)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				http.Error(w, "Invalid login", http.StatusUnauthorized)
				return
			}
			log.Println("db error:", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		match := CheckPasswordHash(loginInput.Password, user.Password)
		if !match {
			http.Error(w, "Username or password is incorrect.", http.StatusUnauthorized)
			return
		}

		user.Password = ""

		token, err := GenerateJWT(JWT_SECRET, user)
		if err != nil {
			fmt.Println("Failed to generate token")
		}

		json.NewEncoder(w).Encode(token)
	}).Methods("POST")

	nonAuth.HandleFunc("/signup", func(w http.ResponseWriter, r *http.Request) {
		var registerInput models.RegisterInput
		reqBody, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		json.Unmarshal(reqBody, &registerInput)

		passwordHash, err := HashPassword(registerInput.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var newCompany models.Company
		err = db.QueryRow(`INSERT INTO companies (name) VALUES($1) RETURNING id`, registerInput.CompanyName).Scan(&newCompany.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		_, err = db.Query(`INSERT INTO users (first_name, last_name, company_id, username, password, email) VALUES($1, $2, $3, $4, $5, $6)`,
			registerInput.FirstName, registerInput.LastName, newCompany.ID, registerInput.Username, passwordHash, registerInput.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusOK)
	}).Methods("POST")

	port := os.Getenv("PORT")
	if port != "" {
		port = ":" + port
	} else {
		port = ":8080"
	}

	log.Fatal(http.ListenAndServe(port, router))
}
