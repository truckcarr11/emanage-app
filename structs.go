package main

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterInput struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	CompanyId int    `json:"companyId" binding:"required"`
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
}

type Company struct {
	Id   int
	Name string
}

type Employee struct {
	Id           int
	PositionId   int
	PositionName string
	CompanyId    int
	FirstName    string
	LastName     string
	Username     string
	Password     string
	IsAdmin      int
}

type Position struct {
	Id        int
	CompanyId int
	Name      string
}
