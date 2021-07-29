package models

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterInput struct {
	FirstName   string `json:"firstName" binding:"required"`
	LastName    string `json:"lastName" binding:"required"`
	Email       string `json:"email" binding:"required"`
	CompanyName string `json:"companyName" binding:"required"`
	Username    string `json:"username" binding:"required"`
	Password    string `json:"password" binding:"required"`
}

type CreateEmployeeInput struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	CompanyID int    `json:"companyId" binding:"required"`
}

type CreatePositionInput struct {
	CompanyID int    `json:"companyId" binding:"required"`
	Name      string `json:"name" binding:"required"`
}

type Company struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Employee struct {
	ID           int    `json:"id"`
	PositionID   int    `json:"positionId"`
	PositionName string `json:"positionName"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
}

type User struct {
	ID          int    `json:"id"`
	CompanyID   int    `json:"companyId"`
	CompanyName string `json:"companyName"`
	Username    string `json:"username"`
	Password    string `json:"password"`
}

type Position struct {
	ID        int    `json:"id"`
	CompanyID int    `json:"companyId"`
	Name      string `json:"name"`
}
