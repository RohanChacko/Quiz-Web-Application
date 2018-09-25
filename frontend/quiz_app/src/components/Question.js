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

class Question extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      questionid: "",
      postquestionjson: {
        qnstring: "",
        quizid: 0,
      },
      deletequestionid: "",
    }
    this.handlequestion  = this.handlequestion.bind(this);
    this.handleQuestionVal = this.handleQuestionVal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelQuestionID = this.handleDelQuestionID.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

    this.state.postquestionjson.quizid = this.props.match.params.quizid;
    const request = 'http://localhost:8080/user/1/question/create/' + this.props.match.params.quizid;
    fetch(request, {
      method: 'POST',
      body: JSON.stringify(this.state.postquestionjson)
    }).then(response => {
      if (response.status >= 200 && response.status < 300)
        this.setState({submitted: true});
      }
    );
  };

  handleQuestionVal(event) {
    this.state.postquestionjson.qnstring = event.target.value;
  };

  handleDelQuestionID(event) {
    this.setState({deletequestionid: event.target.value});
  };

  handleDelete(event) {
    var string = "http://localhost:8080/user/1/question/delete/" + this.state.deletequestionid;
    fetch(string, {method: 'DELETE'});
  };

  handlequestion(event) {
    this.state.questionid = event.currentTarget.value;
    const request = "/MulChoice/" + this.state.questionid;
    // window.location.assign(request);
    this.props.history.push(request);
  }

  componentDidMount() {
    const string = 'http://localhost:8080/user/1/question/show/'+this.props.match.params.quizid;
    const request = new Request(string);
    fetch(request).then(response => response.json()).then(data => this.setState({data: data}));
  }

  render() {
    const {classes,theme} = this.props;
    return (

      <div className="App">
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth>
            <Tab label="Create Question" />
            <Tab label="View Question" />
            <Tab label="Delete Question" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}>
          <TabContainer dir={theme.direction}>
            <Typography variant="display2">Create Question
            </Typography>

            <form className={classes.form} onSubmit={this.handleSubmit}>
              <FormControl margin="normal" required="required" fullWidth="fullWidth">
                <InputLabel htmlFor="question">
                  Question
                </InputLabel >
                <Input name="questionval" type="questionval" id="questionval" value={this.state.questionnameval} onChange={this.handleQuestionVal}/>
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
              <TableCell numeric="numeric">Question ID</TableCell>
              <TableCell>Question String</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.state.data.map(function(item, key) {
                return (<TableRow className={classes.row} key={key}>
                  <TableCell component="th" scope="row">{item.ID}</TableCell>
                  <TableCell>
                    <Button value={item.ID} onClick={this.handlequestion}>{item.QnString}</Button>
                  </TableCell>
                </TableRow>)
              },this)
            }
          </TableBody>
        </Table>
      </Paper>
    </TabContainer>
    <TabContainer dir={theme.direction}>

      <Typography variant="display2">Input Question ID
        </Typography>

        <form className={classes.form} onSubmit={this.handleDelete}>
          <FormControl margin="normal" required="required">
            <InputLabel htmlFor="question">
              Question ID
            </InputLabel >
            <Input name="questionid" type="questionid" id="questionid" value={this.state.deletequestionid} onChange={this.handleDelQuestionID}/>
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

Question.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(Question);
