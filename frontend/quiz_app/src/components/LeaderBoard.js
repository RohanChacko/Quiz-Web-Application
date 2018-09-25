import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AppBar from '@material-ui/core/AppBar';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 1000,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: 250,
    flexGrow: 1
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

class LeaderBoard extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  };

  componentDidMount() {
    const request = new Request('http://localhost:8080/user/1/logtable/show');
    fetch(request).then(response => response.json()).then(data => this.setState({data: data}));
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

    render() {
      const {classes, theme} = this.props;
      return (<div>
        <Router>
          <div className="App">
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell numeric="numeric">UserID</TableCell>
                    <TableCell>Quiz ID</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.state.data.map(function(item, key) {
                      return (<TableRow className={classes.row} key={key}>
                        <TableCell component="th" scope="row">{item.QuizID}</TableCell>
                        <TableCell>
                          <Button>{item.userid}</Button>
                        </TableCell>
                        <TableCell>{item.Score}</TableCell>
                      </TableRow>)
                    }, this)
                  }
                </TableBody>
              </Table>
            </Paper>
          </div>
        </Router>
      </div>);
    }
  }

  LeaderBoard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };
  export default withStyles(styles, {withTheme: true})(LeaderBoard);
