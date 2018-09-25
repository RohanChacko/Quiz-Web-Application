import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: `${ 450}px`,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class TakeQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        choiceid: 0
      },
      qndata: [],
      choicedata: [],
      submitted: false,
      lol: {
        ID: 0,
        QuizID: 0,
        QnString: ""
      },
      i: 0,
      fetchchoice: true
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateQuiz = this.generateQuiz.bind(this);
    this.handleiter = this.handleiter.bind(this);
    this.getchoices = this.getchoices.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:8080/register', {
      method: 'POST',
      body: JSON.stringify(this.state.formData)
    }).then(response => {
      if (response.status >= 200 && response.status < 300)
        this.setState({submitted: true});
      }
    );
  }

  getchoices(id) {

    if (this.state.fetchchoice == true) {
      const string = 'http://localhost:8080/user/1/mulchoice/show/' + id;
      const request = new Request(string);
      fetch(request).then(response => response.json()).then(data => this.setState({choicedata: data}));
      this.setState({fetchchoice: false});
    }
  };

  generateQuiz() {
    if (this.state.i < this.state.qndata.length) {
      this.getchoices(this.state.qndata[this.state.i].ID);
      return this.state.qndata[this.state.i];
    }

  }

  handleiter(event) {
    this.setState({
      i: this.state.i + 1
    });
    this.setState({fetchchoice: true});
  }

  componentDidMount() {
    const string = 'http://localhost:8080/user/1/question/show/' + this.props.match.params.quizid;
    const request = new Request(string);
    fetch(request).then(response => response.json()).then(data => this.setState({qndata: data}));
  };

  render() {
    const {classes} = this.props;
    return (<div>
      <CssBaseline/>
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="display1">
            {this.props.match.params.quizname}
          </Typography>
          <br/><br/><br/> {
            this.state.qndata.length > 0 && <div>
                <Typography variant="headline">
                  {this.generateQuiz().QnString}
                </Typography>
                <br/><br/><br/>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Pick an option</FormLabel>
                  <FormGroup>
                    {
                      this.state.choicedata.map(function(item, key) {
                        return (
                            <FormControlLabel control={<Checkbox onChange = {this.handleiter} value = {item.ChoiceString} />} label={item.ChoiceString}/>
                          )
                      }, this)
                    }
                  </FormGroup>
                </FormControl>
                <br/><br/><br/>
                <Button variant="raised" color="primary" value={this.generateQuiz().ID} onClick={this.handleiter}>Next Question</Button>
              </div>
          }
        </Paper>
      </div>
    </div>);
  }
}

TakeQuiz.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TakeQuiz);
