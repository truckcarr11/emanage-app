package helpers

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
	CompanyId int    `json:"companyId" binding:"required"`
}

type CreatePositionInput struct {
	CompanyID int    `json:"companyId" binding:"required"`
	Name      string `json:"name" binding:"required"`
}

type Company struct {
	Id   int
	Name string
}

type Employee struct {
	Id           int
	PositionId   int
	PositionName string
	FirstName    string
	LastName     string
}

type User struct {
	Id          int
	CompanyId   int
	CompanyName string
	Username    string
	Password    string
}

type Position struct {
	Id        int
	CompanyId int
	Name      string
}
