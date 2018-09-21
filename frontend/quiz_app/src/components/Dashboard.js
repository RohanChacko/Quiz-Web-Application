import React, {Component} from 'react';
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
import './Home.css'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 1000,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: 250,
  },

  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
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

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    }
  }

  componentDidMount()  {
    const request = new Request('http://localhost:8080/user/1/genre/show');
    fetch(request).then(response => response.json())
     .then(data => this.setState({data: data}));
  }

  render() {
    const {classes} = this.props;
    return (<div className="App">
      <header className="App-header">
        <Typography variant="display3" gutterBottom="gutterBottom" className="App-title">Create Quiz</Typography>
        <Button type="submit" variant="outlined" color="secondary" className={classes.button}>
          <Typography variant="headline" gutterBottom="gutterBottom" className="App-title">Choose Genre</Typography>
        </Button>
      </header>

      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell numeric>Genre ID</TableCell>
              <TableCell>Genre Name</TableCell>
              <TableCell>Number of Quizes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.state.data.map(function(item, key) {
                return (<TableRow className={classes.row} key={key}>
                  <TableCell component="th" scope="row">{item.GenreID}</TableCell>
                  <TableCell>{item.GenreName}</TableCell>
                  <TableCell>{item.NumQuiz}</TableCell>
                </TableRow>)
              })
            }
          </TableBody>
        </Table>
      </Paper>
    </div>);
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Dashboard);
