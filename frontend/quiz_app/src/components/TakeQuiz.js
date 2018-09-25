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
    margin: theme.spacing.unit * 3
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: `${450}px`,
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
      fetchchoice: true,
      score: 0,
      possibletruth: [],
      postdata: {
        userid: 0,
        quizid: 0,
        score: 0,
      },
    }

    this.generateQuiz = this.generateQuiz.bind(this);
    this.handleiter = this.handleiter.bind(this);
    this.getchoices = this.getchoices.bind(this);
    this.handleTruthCheck = this.handleTruthCheck.bind(this);
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

    if(this.state.i == this.state.qndata.length )
    {
      window.alert("Final Score: "+(this.state.score));

      this.state.postdata.score = this.state.score;
      this.state.postdata.userid = 1;
      this.state.postdata.quizid = Number(this.props.match.params.quizid);

      fetch('http://localhost:8080/user/1/logtable/create', {
        method: 'POST',
        body: JSON.stringify(this.state.postdata)
      });

      const request = "/Leaderboard";
      this.props.history.push(request);

    }

    if (this.state.i < this.state.qndata.length) {
      this.getchoices(this.state.qndata[this.state.i].ID);
      return this.state.qndata[this.state.i];
    }

  }

  handleTruthCheck(ID, event) {

    if(event.target.checked){
      this.state.possibletruth.push(ID);
    }
    else{
      var index = this.state.possibletruth.indexOf(ID);
      if (index > -1) {
        this.state.possibletruth.splice(index, 1);
      }
    }
  }

  handleiter(event) {
    var t1 = 0;
    for (var p = 0; p < this.state.choicedata.length; p++) {
      if (this.state.choicedata[p].Answer == true) {
        t1++;
      };
    }
    let unique = [...new Set(this.state.possibletruth)];

    if (t1 == unique.length) {
      this.setState({
        score: this.state.score + 10
      });
    }

    // window.alert(t1);
    // window.alert(unique.length);
    // window.alert(unique);
    this.setState({possibletruth: []});
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
                        return (<FormControlLabel key={item.ID} control={<Checkbox onChange = {
                            this.handleTruthCheck.bind(item,item.ID)
                          }
                          value = {
                            item.Answer
                          } />} label={item.ChoiceString}/>)
                      }, this)
                    }
                  </FormGroup>
                </FormControl>
                <br/><br/><br/>
                <Button type ="submit" variant="raised" color="primary" value={this.generateQuiz().ID} onClick={this.handleiter}>Next Question</Button>

                <Typography variant="headline">Score: {this.state.score}</Typography>
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
