package main

import (
	"fmt"
	//"strconv"
	//"encoding/json"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	// "./routes/callback"
	// "./routes/login"
	// "./app"
	"time"
)

var db *gorm.DB
var err error

type User struct {
	ID        uint   `json:"userid"; gorm:"primary_key;unique_index"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json: "email"`
	Password  string `json: "password"`
}

type Genre struct {
	GenreID   uint   `json: "genreid"; gorm:"primary_key;unique_index"`
	GenreName string `json: "genrename"`
	NumQuiz   uint   `json: "numquiz"`
}

type Quiz struct {
	QuizID    uint   `json: "quizid"; gorm:"primary_key;unique_index"`
	QuizName  string `json: "quizname"`
	GenreID   Genre  `json: "genreid" gorm: "ForeignKey:GenreID"`
	HighScore uint   `json: "highscore"`
}

type Question struct {
	QuestionID uint   `json: "questionid"; gorm:"primary_key;unique_index"`
	QuizID     Quiz   `json: "quizid" gorm: "ForeignKey:QuizID"`
	QnString   string `json: "qnstring" gorm: "type:varchar(300)"`
}

type MulChoice struct {
	ChoiceID     uint     `json: "choiceid"; gorm: "primary_key;unique_index"`
	QuestionID   Question `json: "questionid" gorm: "primary_key"`
	ChoiceString string   `json: "choicestring"`
}

type Match struct {
	QuestionID Question  `json: "questionid" gorm: "ForeignKey:QuestionID; primary_key"`
	ChoiceID   MulChoice `json: "choiceid" gorm: "ForeignKey: ChoiceID; primary_key"`
	Answer     string    `json: "answerchoice"`
}

type LogTable struct {
	UserID    User      `json:"userid" gorm: "ForeignKey: UserID; primary_key"`
	QuizID    Quiz      `json: "quizid" gorm: "ForeignKey:QuizID; primary_key"`
	Score     uint      `json: "score"`
	TimeTaken time.Time `json: timetaken`
}

func main() {
	//app.Init()
	db, err = gorm.Open("sqlite3", "./server.db")

	if err != nil {
		fmt.Println(err)
	}

	defer db.Close()

	db.AutoMigrate(&User{}, &Genre{}, &Quiz{}, &Question{}, &MulChoice{}, &Match{}, &LogTable{})

	router := gin.Default()

	// router.HandleFunc("/callback", callback.CallbackHandler)
	// router.HandleFunc("/login", login.LoginHandler)
	router.GET("/user/:userid/show/:viewid", GetUser)
	router.GET("/user/:userid/show", GetUsers)
	router.POST("/register", RegisterUser)
	router.POST("/user/:userid", Login)
	router.DELETE("/user/:userid/delete/:deleteid", DeleteUser)

	router.POST("/user/:userid/genre/create", CreateGenre)
	router.GET("/user/:userid/genre/show", GetGenres)
	router.GET("/user/:userid/genre/show/:genreid", GetGenre)
	router.DELETE("/user/:userid/genre/delete/:genreid", DeleteGenre)

	// router.POST("/user/:userid/quiz/create", CreateQuiz)
	// router.GET("/user/:userid/quiz/show", GetQuizes)
	// router.GET("/user/:userid/quiz/show/:quizid", GetQuiz)
	// router.DELETE("/user/:userid/quiz/delete/:quizid", DeleteQuiz)

	router.Use((cors.Default()))
	router.Run(":8080")
}

func RegisterUser(c *gin.Context) {
	var user User
	c.BindJSON(&user)
	db.Create(&user)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, user)
}

func Login(c *gin.Context) {
	var user User
	email:=c.Params.ByName("userid")

	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		fmt.Println(user.Password)
		c.JSON(200, user.Password)
	}
}

func GetUser(c *gin.Context) {
	id := c.Params.ByName("viewid")
	var user User
	fmt.Println(id)

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, user)
	}
}

func GetUsers(c *gin.Context) {
	var users []User
	if err := db.Find(&users).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, users)
	}
}

func DeleteUser(c *gin.Context) {
	id := c.Params.ByName("deleteid")
	var user User
	d := db.Where("id = ?", id).Delete(&user)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"userid #" + id: "deleted"})
}

func CreateGenre(c *gin.Context) {
	var genre Genre
	c.BindJSON(&genre)
	db.Create(&genre)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, genre)
}

func GetGenre(c *gin.Context) {
	id := c.Params.ByName("genreid")
	var genre Genre
	fmt.Println(id)

	if err := db.Where("id = ?", id).First(&genre).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, genre)
	}
}

func GetGenres(c *gin.Context) {
	var genres []Genre
	if err := db.Find(&genres).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, genres)
	}
}

func DeleteGenre(c *gin.Context) {
	id := c.Params.ByName("genreid")
	var genre Genre
	d := db.Where("id = ?", id).Delete(&genre)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"genreid #" + id: "deleted"})
}
