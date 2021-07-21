package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	router.POST("/login", func(c *gin.Context) {
		var loginInput LoginInput
		if err := c.ShouldBindJSON(&loginInput); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fmt.Println(loginInput.Username)
	})

	router.Run()
}
