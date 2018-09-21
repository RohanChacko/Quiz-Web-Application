import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Register from './Register';
import Home from './Home';
import Dashboard from './Dashboard';
import './App.css'

const styles = theme => ({
  root: {
    width: '100%'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },

  icon: {
    margin: theme.spacing.unit
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

const style = {
  color: "inherit",
  fontSize: "0.875rem",
  textTransform: "uppercase",
  fontWeight: "500",
  color: "white",
  textDecoration: "none"
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        email: "",
        password: ""
      },
      data: "",
      submitted: true,
    }

    this.handleemail = this.handleemail.bind(this);
    this.handlepassword = this.handlepassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit(event) {
    {/* event.preventDefault(); */
    }
    const data = 'http://localhost:8080/user/' + this.state.formData.email;
    fetch(data, {
      method: 'POST',
      body: JSON.stringify(this.state.formData)
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.setState({submitted: false});
        this.setState({data: data});
        const request = "http://localhost:3000/Dashboard";
        window.location.assign(request);
      }
    });

  }

  handleemail(event) {
    this.state.formData.email = event.target.value;
  }

  handlepassword(event) {
    this.state.formData.password = event.target.value;
  }
  render() {
    const {classes} = this.props;

    return (<div>
      <CssBaseline/>
      <Router>
        <div>
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="title" color="inherit" className={classes.grow} align="center">
                  Quiz App
                </Typography>

                <Link to={'/Home'} className="Link">
                  <Button style={style}>
                    Home
                  </Button>
                </Link>
                {
                  this.state.submitted &&
                  (<div>
                      <Link to={'/Register'} className="Link">
                        <Button style={style}>
                          Register
                        </Button>
                      </Link>

                      <Button style={style} onClick={this.handleClickOpen}>
                        Login
                      </Button>

                      <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <Paper className={classes.paper}>

                          <AccountCircle className={classes.icon}/>

                          <Typography variant="headline">Sign in</Typography>
                          <form className={classes.form} onSubmit={this.handleSubmit}>
                            <FormControl margin="normal" required="required" fullWidth="fullWidth">
                              <InputLabel htmlFor="email">
                                Email ID
                              </InputLabel >
                              <Input name="email" type="email" id="emailid" autoComplete="email" value={this.state.email} onChange={this.handleemail}/>
                            </FormControl>

                            <FormControl margin="normal" required="required" fullWidth="fullWidth">
                              <InputLabel htmlFor="password">
                                Password
                              </InputLabel >
                              <Input name="password" type="password" id="password" autoComplete="current-password" value={this.state.password} onChange={this.handlepassword}/>
                            </FormControl>

                            <Button type="submit" fullWidth="fullWidth" variant="raised" color="primary" className={classes.submit}>
                              Sign in
                            </Button>
                          </form>
                        </Paper>
                      </Dialog>
                    </div>)
                }
              </Toolbar>
            </AppBar>
          </div>

          <Switch>
            <Route exact="exact" path='/Register' component={Register}/>
            <Route exact="exact" path='/Dashboard' component={Dashboard}></Route>
            <Route exact="exact" path='/Home' component={Home}/>
          </Switch>
        </div>
      </Router>

      {/*<Dashboard submitted={this.state.submitted}/>*/}
    </div>);
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
