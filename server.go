package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/lib/pq"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	DATABASE_URL, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		log.Fatalln("Database url does not exist")
	}

	db, err := sql.Open("postgres", DATABASE_URL)
	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()

	//Serve the index.html page for the base route
	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	//Group any API routes under the /api route
	api := router.Group("/api")
	{
		api.GET("/companies", func(c *gin.Context) {
			rows, err := db.Query(`SELECT id, name FROM companies`)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var companies []Company
			for rows.Next() {
				var company Company
				rows.Scan(&company.Id, &company.Name)
				companies = append(companies, company)
			}
			if err = rows.Err(); err != nil {
				log.Println(err)
			}

			c.JSON(http.StatusOK, gin.H{"data": companies})
		})

		api.GET("/company/:companyId/employees", func(c *gin.Context) {
			companyId, err := strconv.Atoi(c.Param("companyId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			rows, err := db.Query(`SELECT employees.id, p.id, p.name as position_name, employees.company_id, first_name, last_name, is_admin FROM employees JOIN positions p ON p.id = employees.position_id WHERE employees.company_id=$1`, companyId)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var employees []Employee
			for rows.Next() {
				var employee Employee
				rows.Scan(&employee.Id, &employee.PositionId, &employee.PositionName, &employee.CompanyId, &employee.FirstName, &employee.LastName, &employee.IsAdmin)
				employees = append(employees, employee)
			}
			if err = rows.Err(); err != nil {
				log.Println(err)
			}

			c.JSON(http.StatusOK, gin.H{"data": employees})
		})

		api.GET("/company/:companyId/positions", func(c *gin.Context) {
			companyId, err := strconv.Atoi(c.Param("companyId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			rows, err := db.Query(`SELECT * FROM positions WHERE company_id=$1`, companyId)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
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

			c.JSON(http.StatusOK, gin.H{"data": positions})
		})

		api.POST("/signin", func(c *gin.Context) {
			var loginInput LoginInput
			if err := c.ShouldBindJSON(&loginInput); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var employee Employee

			err := db.QueryRow(`SELECT password, company_id, id FROM employees WHERE username=$1`, loginInput.Username).Scan(&employee.Password, &employee.CompanyId, &employee.Id)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			match := CheckPasswordHash(loginInput.Password, employee.Password)

			if !match {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Username or Password does not match."})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"status":     http.StatusOK,
				"companyId":  employee.CompanyId,
				"employeeId": employee.Id,
			})
		})

		api.POST("/signup", func(c *gin.Context) {
			var registerInput RegisterInput
			if err := c.ShouldBindJSON(&registerInput); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			passwordHash, err := HashPassword(registerInput.Password)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			_, err = db.Query(`INSERT INTO employees (first_name, last_name, company_id, username, password) VALUES($1, $2, $3, $4, $5)`,
				registerInput.FirstName, registerInput.LastName, registerInput.CompanyId, registerInput.Username, passwordHash)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"status": http.StatusOK,
			})
		})
	}

	//Handle any other routes, mostly for serving the index.html page since we are using react router
	router.GET("/*", func(c *gin.Context) {
		c.File("/client/build/index.html")
	})

	router.Run()
}
