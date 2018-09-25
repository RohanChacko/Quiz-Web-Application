import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
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
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class Register extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      },
      submitted: false,
    }
    this.handlefirstname = this.handlefirstname.bind(this);
    this.handlelastname = this.handlelastname.bind(this);
    this.handleemail = this.handleemail.bind(this);
    this.handlepassword = this.handlepassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:8080/register', {
      method: 'POST',
      body: JSON.stringify(this.state.formData)
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300)
        this.setState({submitted: true});
      }
    );
  }

  handlefirstname(event) {
    this.state.formData.firstname = event.target.value;
  }
  handlelastname(event) {
    this.state.formData.lastname = event.target.value;
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
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="headline">
            Register
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required="required" fullWidth="fullWidth">
              <InputLabel htmlFor="text">
                Firstname
              </InputLabel >
              <Input name="firstname" type="text" id="firstname" autoComplete="firstname" value={this.state.firstname} onChange={this.handlefirstname}/>
            </FormControl>

            <FormControl margin="normal" required="required" fullWidth="fullWidth">
              <InputLabel htmlFor="text">
                Lastname
              </InputLabel >
              <Input name="lastname" type="text" id="lastname" autoComplete="lastname" value={this.state.lastname} onChange={this.handlelastname}/>
            </FormControl>

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
              Register
            </Button >
          </form>
        </Paper>
      </div>
    </div>);
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Register);
