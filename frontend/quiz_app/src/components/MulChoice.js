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
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
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

class MulChoice extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      mulchoiceid: "",
      postmulchoicejson: {
        questionid: 0,
        choicestring: "",
        answer: true,
      },
      deletemulchoiceid: "",
      truthvaltemp: false
    }
    this.handlemulchoice = this.handlemulchoice.bind(this);
    this.handleMulChoiceVal = this.handleMulChoiceVal.bind(this);
    this.handletruthval = this.handletruthval.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelMulChoiceID = this.handleDelMulChoiceID.bind(this);
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
    this.state.postmulchoicejson.questionid = Number(this.props.match.params.questionid);
    // window.alert(this.state.postmulchoicejson);
    // window.alert(typeof(this.state.postmulchoicejson.answerval));
    // window.alert("this state : ", this.state);
    const request = 'http://localhost:8080/user/1/mulchoice/create/' + this.props.match.params.questionid;
    console.log(request)
    fetch(request, {
      method: 'POST',
      body: JSON.stringify(this.state.postmulchoicejson)
    }).then(response => {
      if (response.status >= 200 && response.status < 300)
      {window.alert("The resturn",response.json())
        this.setState({submitted: true});}
      }
    );
  };

  handleMulChoiceVal(event) {
    this.state.postmulchoicejson.choicestring = event.target.value;
  };

  handletruthval(event) {
    this.setState({truthvaltemp: event.target.value});
    // window.alert(typeof(event.target.value));
    if (event.target.value === "false")
      this.state.postmulchoicejson.answer = false;
      // this.setState(postmulchoicejson{answerval: false});
    else
      this.state.postmulchoicejson.answer = true;

      // window.alert(this.state.postmulchoicejson.answerval);
      // window.alert(typeof(this.state.postmulchoicejson.answerval));

    };

  handleDelMulChoiceID(event) {
    this.setState({deletemulchoiceid: event.target.value});
  };

  handleDelete(event) {
    var string = "http://localhost:8080/user/1/mulchoice/delete/" + this.state.deletemulchoiceid;
    fetch(string, {method: 'DELETE'});
  };

  handlemulchoice(event) {
    this.state.mulchoiceid = event.currentTarget.value;
    //const request = "http://localhost:3000/MulChoice/" + this.state.questionid;
    //window.location.assign(request);
    // window.alert(this.state.mulchoiceid);
  }

  componentDidMount() {
    const string = 'http://localhost:8080/user/1/mulchoice/show/' + this.props.match.params.questionid;
    const request = new Request(string);
    fetch(request).then(response => response.json()).then(data => this.setState({data: data}));
  }

  render() {
    const {classes, theme} = this.props;
    return (<div className="App">
      <AppBar position="static" color="default">
        <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary" fullWidth="fullWidth">
          <Tab label="Create Choice"/>
          <Tab label="View Choice"/>
          <Tab label="Delete Choice"/>
        </Tabs>
      </AppBar>
      <SwipeableViews axis={theme.direction === 'rtl'
          ? 'x-reverse'
          : 'x'} index={this.state.value} onChangeIndex={this.handleChangeIndex}>
        <TabContainer dir={theme.direction}>

          <Typography variant="display2">Create Choice
          </Typography>

          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required="required" fullWidth="fullWidth">
              <InputLabel htmlFor="mulchoice">
                Choice String
              </InputLabel >
              <Input name="mulchoiceval" type="mulchoiceval" id="mulchoiceval" value={this.state.mulchoiceval} onChange={this.handleMulChoiceVal}/>
            </FormControl>

            <br/>
            <br/>

            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Truth Value</FormLabel>
              <RadioGroup aria-label="TruthVal" name="truthval" className={classes.group} value={this.state.truthvaltemp} onChange={this.handletruthval}>
                <FormControlLabel value="true" control={<Radio />} label="True"/>
                <FormControlLabel value="false" control={<Radio />} label="False"/>
              </RadioGroup>
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
                  <TableCell numeric="numeric">Choice ID</TableCell>
                  <TableCell>Choice String</TableCell>
                  <TableCell>Truth Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.data.map(function(item, key) {
                    return (<TableRow className={classes.row} key={key}>
                      <TableCell component="th" scope="row">{item.ID}</TableCell>
                      <TableCell>
                        <Button value={item.Answer} onClick={this.handlemulchoice}>{item.ChoiceString}</Button>
                      </TableCell>
                      <TableCell>{String(item.Answer)}</TableCell>
                    </TableRow>)
                  }, this)
                }
              </TableBody>
            </Table>
          </Paper>
        </TabContainer>
        <TabContainer dir={theme.direction}>

          <Typography variant="display2">Input Choice ID
          </Typography>

          <form className={classes.form} onSubmit={this.handleDelete}>
            <FormControl margin="normal" required="required">
              <InputLabel htmlFor="mulchoice">
                Choice ID
              </InputLabel >
              <Input name="mulchoiceid" type="mulchoiceid" id="mulchoiceid" value={this.state.deletemulchoiceid} onChange={this.handleDelMulChoiceID}/>
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

MulChoice.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default withStyles(styles, {withTheme: true})(MulChoice);
