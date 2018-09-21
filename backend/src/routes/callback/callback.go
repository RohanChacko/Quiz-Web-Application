package callback

import (
  "fmt"
	"context"
	_ "crypto/sha512"
	"encoding/json"
	"../../app"
	"golang.org/x/oauth2"
	"github.com/gin-gonic/gin"
	"os"
)


func CallbackHandler(c *gin.Context) {

	domain := "webapprohan.auth0.com"

	conf := &oauth2.Config{
		ClientID:     "wLuvARwXqaYZbsIyzJuvdZmLEQ5pNq7K",
		ClientSecret: "YOUR_CLIENT_SECRET",
		RedirectURL:  "http://localhost:3000/callback",
		Scopes:       []string{"openid", "profile"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://" + domain + "/authorize",
			TokenURL: "https://" + domain + "/oauth/token",
		},
	}
	state := c.Request.URL.Query().Get("state")
	session, err := app.Store.Get(c, "state")
	if err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}

	if state != session.Values["state"] {
    c.AbortWithStatus(404)
    fmt.Println("Invalid state parameter")
		return
	}

	code := c.Request.URL.Query().Get("code")

	token, err := conf.Exchange(context.TODO(), code)
	if err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}

	// Getting now the userInfo
	client := conf.Client(context.TODO(), token)
	resp, err := client.Get("https://" + domain + "/userinfo")
	if err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}

	defer resp.Body.Close()

	var profile map[string]interface{}
	if err = json.NewDecoder(resp.Body).Decode(&profile); err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}

	session, err = app.Store.Get(c, "auth-session")
	if err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}

	session.Values["id_token"] = token.Extra("id_token")
	session.Values["access_token"] = token.AccessToken
	session.Values["profile"] = profile
	err = session.Save()
	if err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}

	// Redirect to logged in page
  c.Redirect(http.StatusSeeOther, "http://www.google.com/")

}
