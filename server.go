package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"github.com/truckcarr11/emanage/helpers"
	"github.com/truckcarr11/emanage/routes"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func SetDB(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Set("db", db)
		c.Next()
	}
}

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

	router.Use(SetDB(db))

	//Serve the index.html page for the base route
	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	//Set up the companies router
	routes.Companies(router)

	//Set up the positions router
	routes.Positions(router)

	//Group any API routes under the /api route
	//Handle any routes that arent by the above route handlers
	api := router.Group("/api")
	{
		api.GET("/companies", func(c *gin.Context) {
			rows, err := db.Query(`SELECT id, name FROM companies`)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var companies []helpers.Company
			for rows.Next() {
				var company helpers.Company
				rows.Scan(&company.Id, &company.Name)
				companies = append(companies, company)
			}
			if err = rows.Err(); err != nil {
				log.Println(err)
			}

			c.JSON(http.StatusOK, gin.H{"data": companies})
		})

		api.POST("/signin", func(c *gin.Context) {
			var loginInput helpers.LoginInput
			if err := c.ShouldBindJSON(&loginInput); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var user helpers.User

			err := db.QueryRow(`SELECT u.username, u.password, u.company_id, c.name, u.id FROM users u JOIN companies c ON c.id=u.company_id WHERE u.username=$1`,
				loginInput.Username).Scan(&user.Username, &user.Password, &user.CompanyId, &user.CompanyName, &user.Id)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			match := helpers.CheckPasswordHash(loginInput.Password, user.Password)

			if !match {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Username or Password does not match."})
				return
			}

			user.Password = ""

			c.JSON(http.StatusOK, gin.H{
				"status": http.StatusOK,
				"user":   user,
			})
		})

		api.POST("/signup", func(c *gin.Context) {
			var registerInput helpers.RegisterInput
			if err := c.ShouldBindJSON(&registerInput); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			passwordHash, err := helpers.HashPassword(registerInput.Password)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var newCompany helpers.Company
			err = db.QueryRow(`INSERT INTO companies (name) VALUES($1) RETURNING id`, registerInput.CompanyName).Scan(&newCompany.Id)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			_, err = db.Query(`INSERT INTO users (first_name, last_name, company_id, username, password, email) VALUES($1, $2, $3, $4, $5, $6)`,
				registerInput.FirstName, registerInput.LastName, newCompany.Id, registerInput.Username, passwordHash, registerInput.Email)
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
	router.NoRoute(func(c *gin.Context) {
		c.File("./client/build/index.html")
	})

	router.Run()
}
