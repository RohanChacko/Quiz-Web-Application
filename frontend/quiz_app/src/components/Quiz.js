import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import './Home.css';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 1000,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: 250,
    flexGrow: 1
  },

  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  table: {
    minWidth: 1000
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

function TabContainer({children, dir}) {
  return (<Typography component="div" dir={dir} style={{
      padding: 8 * 3
    }}>
    {children}
  </Typography>);
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

class Quiz extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      quizid: "",
      postquizjson: {
        quizname: "",
        genreid: 0,
        highscore: 0,
      },
      deletequizid: "",
    }
    this.handlequiz = this.handlequiz.bind(this);
    this.handleQuizVal = this.handleQuizVal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelQuizID = this.handleDelQuizID.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handletakequiz = this.handletakequiz.bind(this);

  }
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({value});
  };

  handleChangeIndex = index => {
    this.setState({value: index});
  };

  handleSubmit(event) {

    this.state.postquizjson.genreid = this.props.match.params.genreid;
    const request = 'http://localhost:8080/user/1/quiz/create/' + this.props.match.params.genreid;
    fetch(request, {
      method: 'POST',
      body: JSON.stringify(this.state.postquizjson)
    }).then(response => {
      if (response.status >= 200 && response.status < 300)
        this.setState({submitted: true});
      }
    );
  };

  handleQuizVal(event) {
    this.state.postquizjson.quizname = event.target.value;
  };

  handleDelQuizID(event) {
    this.setState({deletequizid: event.target.value});
  };

  handleDelete(event) {
    const string = "http://localhost:8080/user/1/quiz/delete/" + this.state.deletequizid;
    fetch(string, {method: 'DELETE'});
  };

  handletakequiz(event) {
    const request = "/TakeQuiz/" + event.currentTarget.value ;
    this.props.history.push(request);
  }

  handlequiz(event) {
    this.state.quizid = event.currentTarget.value;
    const request = "/Question/" + this.state.quizid;
    // window.location.assign(request);
    this.props.history.push(request);
  };

  componentDidMount() {
    const string = 'http://localhost:8080/user/1/quiz/show/' + this.props.match.params.genreid;
    const request = new Request(string);
    fetch(request).then(response => response.json()).then(data => this.setState({data: data}));
  }

  render() {
    const {classes, theme} = this.props;
    return (<div className="App">
      <AppBar position="static" color="default">
        <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary" fullWidth="fullWidth">
          <Tab label="Create Quiz"/>
          <Tab label="View Quizes"/>
          <Tab label="Delete Quiz"/>
        </Tabs>
      </AppBar>
      <SwipeableViews axis={theme.direction === 'rtl'
          ? 'x-reverse'
          : 'x'} index={this.state.value} onChangeIndex={this.handleChangeIndex}>
        <TabContainer dir={theme.direction}>
          <Typography variant="display2">Create Quiz
          </Typography>

          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required="required">
              <InputLabel htmlFor="quiz">
                Quiz Name
              </InputLabel >
              <Input name="quizval" type="quizval" id="quizval" value={this.state.quiznameval} onChange={this.handleQuizVal}/>
            </FormControl>
            <br/>
            <Button type="submit" variant="raised" color="primary" className={classes.submit}>
              Create
            </Button >
          </form>

        </TabContainer>
        <TabContainer dir={theme.direction}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell numeric="numeric">Quiz ID</TableCell>
                  <TableCell>Quiz Name</TableCell>
                  <TableCell>HighScore</TableCell>
                  <TableCell>Take Quiz</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.data.map(function(item, key) {
                    return (<TableRow className={classes.row} key={key}>
                      <TableCell component="th" scope="row">{item.ID}</TableCell>
                      <TableCell>
                        <Button value={item.ID} onClick={this.handlequiz}>{item.QuizName}</Button>
                      </TableCell>
                      <TableCell>{item.HighScore}</TableCell>
                      <TableCell><Button value={item.ID + "/"+item.QuizName} onClick={this.handletakequiz}>Take</Button></TableCell>
                    </TableRow>)
                  }, this)
                }
              </TableBody>
            </Table>
          </Paper>
        </TabContainer>
        <TabContainer dir={theme.direction}>
        <Typography variant="display2">Input Quiz ID
          </Typography>

          <form className={classes.form} onSubmit={this.handleDelete}>
            <FormControl margin="normal" required="required">
              <InputLabel htmlFor="quiz">
                Quiz ID
              </InputLabel >
              <Input name="quizid" type="quizid" id="quizid" value={this.state.deletequizid} onChange={this.handleDelQuizID}/>
            </FormControl>
            <br/>
            <Button type="submit" variant="raised" color="secondary" className={classes.submit}>
              Delete
            </Button >
          </form>
        </TabContainer>
      </SwipeableViews>
    </div>);
  }
}

Quiz.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default withStyles(styles, {withTheme: true})(Quiz);
