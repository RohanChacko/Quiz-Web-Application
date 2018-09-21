package login

import (
	"golang.org/x/oauth2"
	"github.com/gin-gonic/gin"
	"os"
	"crypto/rand"
	"encoding/base64"
	"../../app"
)

func LoginHandler(c *gin.Context) {

	domain := "webapprohan.auth0.com"
	aud := "YOUR_API_AUDIENCE"

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

	if aud == "" {
		aud = "https://" + domain + "/userinfo"
	}

	// Generate random state
	b := make([]byte, 32)
	rand.Read(b)
	state := base64.StdEncoding.EncodeToString(b)

	session, err := app.Store.Get(r, "state")
	if err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}
	session.Values["state"] = state
	err = session.Save()
	if err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
		return
	}

	audience := oauth2.SetAuthURLParam("audience", aud)
	url := conf.AuthCodeURL(state, audience)

  c.Redirect(http.StatusTemporaryRedirect, url)
}
