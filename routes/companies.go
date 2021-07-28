package routes

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/truckcarr11/emanage/helpers"

	"github.com/gin-gonic/gin"
)

func Companies(route *gin.Engine) {
	company := route.Group("/api/company")
	{
		company.GET("/:companyId/employees", func(c *gin.Context) {
			db := c.MustGet("db").(*sql.DB)

			companyId, err := strconv.Atoi(c.Param("companyId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			rows, err := db.Query(`SELECT employees.id, p.id as position_id, p.name as position_name, first_name, last_name FROM employees JOIN positions p ON p.id = employees.position_id WHERE employees.company_id=$1`, companyId)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			var employees []helpers.Employee
			for rows.Next() {
				var employee helpers.Employee
				rows.Scan(&employee.Id, &employee.PositionId, &employee.PositionName, &employee.FirstName, &employee.LastName)
				employees = append(employees, employee)
			}
			if err = rows.Err(); err != nil {
				log.Println(err)
			}

			c.JSON(http.StatusOK, gin.H{"data": employees})
		})

		company.GET("/:companyId/positions", func(c *gin.Context) {
			db := c.MustGet("db").(*sql.DB)

			companyId, err := strconv.Atoi(c.Param("companyId"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			positions, err := helpers.GetAllPositions(companyId, db)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"data": positions})
		})
	}
}
