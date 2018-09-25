package main

import (
	"fmt"
	"strconv"
	//"encoding/json"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	// "./routes/callback"
	// "./routes/login"
	// "./app"
	// "time"
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
	ID        uint   `json: "genreid"; gorm:"primary_key;unique_index;"`
	GenreName string `json: "genrename"`
	NumQuiz   uint   `json: "numquiz"`
}

type Quiz struct {
	ID        uint   `json: "quizid"; gorm:"primary_key;unique_index"`
	QuizName  string `json: "quizname"`
	GenreID   uint   `json: "genreid"; gorm: "ForeignKey: GenreID"`
	HighScore uint   `json: "highscore"`
}

type Question struct {
	ID       uint   `json: "questionid"; gorm:"primary_key;unique_index"`
	QuizID   uint   `json: "quizid"; gorm: "ForeignKey: QuizID"`
	QnString string `json: "qnstring"`
}

type MulChoice struct {
	ID           uint   `json: "mulchoiceid"; gorm: "primary_key;unique_index"`
	QuestionID   uint   `json: "questionid"; gorm: "primary_key; ForeignKey: QuestionID"`
	ChoiceString string `json: "choicestring"`
	Answer       bool   `json: "answer"`
}

type LogTable struct {
	UserID    uint      `json:"userid"; gorm: "primary_key; ForeignKey: UserID"`
	QuizID    uint      `json: "quizid"; gorm: "primary_key; ForeignKey: QuizID"`
	Score     uint      `json: "score"`
}

func main() {

	db, err = gorm.Open("sqlite3", "./server.db")

	if err != nil {
		fmt.Println(err)
	}

	defer db.Close()

	db.AutoMigrate(&User{}, &Genre{}, &Quiz{}, &Question{}, &MulChoice{}, &LogTable{})

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
	router.DELETE("/user/:userid/genre/delete/:genreid", DeleteGenre)

	router.POST("/user/:userid/quiz/create/:genreid", CreateQuiz)
	router.GET("/user/:userid/quiz/show/:genreid", GetQuizes)
	router.DELETE("/user/:userid/quiz/delete/:quizid", DeleteQuiz)

	router.POST("/user/:userid/question/create/:quizid", CreateQuestion)
	router.GET("/user/:userid/question/show/:quizid", GetQuestions)
	router.DELETE("/user/:userid/question/delete/:questionid", DeleteQuestion)

	router.POST("/user/:userid/mulchoice/create/:questionid", CreateMulChoice)
	router.GET("/user/:userid/mulchoice/show/:questionid", GetMulChoices)
	router.DELETE("/user/:userid/mulchoice/delete/:mulchoiceid", DeleteMulChoice)

	router.POST("/user/:userid/logtable/create", CreateLogTable)
	router.GET("/user/:userid/logtable/show", GetLogTable)
	router.DELETE("/user/:userid/logtable/delete/:quizid", DeleteGenre)

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
	email := c.Params.ByName("userid")

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

func CreateQuiz(c *gin.Context) {
	var quiz Quiz
	c.BindJSON(&quiz)
	d := c.Params.ByName("genreid")
	u64, err := strconv.ParseUint(d, 10, 32)
	if err != nil {
		fmt.Println(err)
	}
	quiz.GenreID = uint(u64)
	db.Create(&quiz)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, quiz)
}

func GetQuizes(c *gin.Context) {
	var quizes []Quiz
	genreid := c.Params.ByName("genreid")
	fmt.Println(genreid)
	if err := db.Where("genre_id = ?", genreid).Find(&quizes).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, quizes)
	}
}

func DeleteQuiz(c *gin.Context) {
	id := c.Params.ByName("quizid")
	var quiz Quiz
	d := db.Where("id = ?", id).Delete(&quiz)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"quizid #" + id: "deleted"})
}

func CreateQuestion(c *gin.Context) {
	var question Question
	c.BindJSON(&question)
	d := c.Params.ByName("quizid")
	u64, err := strconv.ParseUint(d, 10, 32)
	if err != nil {
		fmt.Println(err)
	}
	question.QuizID = uint(u64)
	db.Create(&question)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, question)
}

func GetQuestions(c *gin.Context) {
	var questions []Question
	quizid := c.Params.ByName("quizid")

	if err := db.Where("quiz_id = ?", quizid).Find(&questions).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, questions)
	}
}

func DeleteQuestion(c *gin.Context) {
	id := c.Params.ByName("questionid")
	var question Question
	d := db.Where("id = ?", id).Delete(&question)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"quizid #" + id: "deleted"})
}

func CreateMulChoice(c *gin.Context) {
	var mulchoice MulChoice
	c.BindJSON(&mulchoice)
	fmt.Println(mulchoice.Answer)
	fmt.Println(mulchoice.ChoiceString)
	d := c.Params.ByName("questionid")
	u64, err := strconv.ParseUint(d, 10, 32)
	if err != nil {
		fmt.Println(err)
	}
	mulchoice.QuestionID = uint(u64)
	db.Create(&mulchoice)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, mulchoice)
}

func GetMulChoices(c *gin.Context) {
	var mulchoices []MulChoice
	questionid := c.Params.ByName("questionid")
	fmt.Println(questionid)
	if err := db.Where("question_id = ?", questionid).Find(&mulchoices).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, mulchoices)
	}
}

func DeleteMulChoice(c *gin.Context) {
	id := c.Params.ByName("mulchoiceid")
	var mulchoice MulChoice
	d := db.Where("id = ?", id).Delete(&mulchoice)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"quizid #" + id: "deleted"})
}

func CreateLogTable(c *gin.Context) {
	var logtable LogTable
	c.BindJSON(&logtable)
	db.Create(&logtable)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, logtable)
}

func GetLogTable(c *gin.Context) {
	var logtable []LogTable
	if err := db.Find(&logtable).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(200, logtable)
	}
}

func DeleteLogTable(c *gin.Context) {
	//userid := c.Params.ByName("userid")
	quizid := c.Params.ByName("quizid")

	var logtable LogTable
	d := db.Where("quiz_id = ?", quizid).Delete(&logtable)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"quizid #" + quizid: "deleted"})
}
