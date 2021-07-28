package routes

import (
	"database/sql"
	"net/http"

	"github.com/truckcarr11/emanage/helpers"

	"github.com/gin-gonic/gin"
)

func Positions(route *gin.Engine) {
	position := route.Group("/api/position")
	{
		position.POST("/", func(c *gin.Context) {
			db := c.MustGet("db").(*sql.DB)

			var createPositionInput helpers.CreatePositionInput
			err := c.ShouldBindJSON(&createPositionInput)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			_, err = db.Query(`INSERT INTO positions (name, company_id) VALUES($1, $2)`, createPositionInput.Name, createPositionInput.CompanyID)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			positions, err := helpers.GetAllPositions(createPositionInput.CompanyID, db)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"status": http.StatusOK,
				"data":   positions,
			})
		})
	}
}
