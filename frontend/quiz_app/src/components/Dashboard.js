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
import Quiz from './Quiz';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 1000,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: 250,
    flexGrow: 1
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
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

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      genreid: "",
      postgenrejson: {
      genrename: "",
      numquiz: 0,
      },
      deletegenreid: "",
      submitted: false,
    }
    this.handlegenre = this.handlegenre.bind(this);
    this.handleGenreVal = this.handleGenreVal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelGenreID = this.handleDelGenreID.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  };

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

    fetch('http://localhost:8080/user/1/genre/create', {
      method: 'POST',
      body: JSON.stringify(this.state.postgenrejson)
    }).then(response => {
      if (response.status >= 200 && response.status < 300)
        this.setState({submitted: true});
      }
    );
  };

  handleGenreVal(event) {
    this.state.postgenrejson.genrename = event.target.value;
  };

  handleDelGenreID(event) {
    this.setState({deletegenreid: event.target.value });
  }

  handleDelete(event) {

    var string ="http://localhost:8080/user/1/genre/delete/"+this.state.deletegenreid;
    fetch(string, {
     method: 'DELETE',
   });
  }

  handlegenre(event) {
    event.preventDefault();
    this.state.genreid = event.currentTarget.value;
    const request = '/Quiz/' + this.state.genreid;
    // window.location.assign(request);
    this.props.history.push(request);
  };

  componentDidMount() {
    const request = new Request('http://localhost:8080/user/1/genre/show');
    fetch(request).then(response => response.json()).then(data => this.setState({data: data}));
  };

  render() {
    const {classes, theme} = this.props;
    return (<div>
      <Router>
        <div className="App">
          <AppBar position="static" color="default">
            <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary" fullWidth="fullWidth">
              <Tab label="Create Genre"/>
              <Tab label="View Genre"/>
              <Tab label="Delete Genre"/>
            </Tabs>
          </AppBar>
          <SwipeableViews axis={theme.direction === 'rtl'
              ? 'x-reverse'
              : 'x'} index={this.state.value} onChangeIndex={this.handleChangeIndex}>
            <TabContainer dir={theme.direction}>
              <Typography variant="display2">Create Genre
              </Typography>

              <form className={classes.form} onSubmit={this.handleSubmit}>
                <FormControl margin="normal" required="required">
                  <InputLabel htmlFor="genre">
                    Genre
                  </InputLabel >
                  <Input name="genreval" type="genreval" id="genreval" value={this.state.genrenameval} onChange={this.handleGenreVal}/>
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
                      <TableCell numeric="numeric">Genre ID</TableCell>
                      <TableCell>Genre Name</TableCell>
                      <TableCell>Number of Quizes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      this.state.data.map(function(item, key) {
                        return (<TableRow className={classes.row} key={key}>
                          <TableCell component="th" scope="row">{item.ID}</TableCell>
                          <TableCell>
                            <Button value={item.ID} onClick={this.handlegenre}>{item.GenreName}</Button>
                          </TableCell>
                          <TableCell>{item.NumQuiz}</TableCell>
                        </TableRow>)
                      }, this)
                    }
                  </TableBody>
                </Table>
              </Paper>
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <Typography variant="display2">Input Genre ID
              </Typography>

              <form className={classes.form} onSubmit={this.handleDelete}>
                <FormControl margin="normal" required="required">
                  <InputLabel htmlFor="genre">
                    Genre ID
                  </InputLabel >
                  <Input name="genreid" type="genreid" id="genreid" value={this.state.deletegenreid} onChange={this.handleDelGenreID}/>
                </FormControl>
                <br/>
                <Button type="submit" variant="raised" color="secondary" className={classes.submit}>
                  Delete
                </Button >
              </form>

            </TabContainer>
          </SwipeableViews>
        </div>
      </Router>
    </div>);
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default withStyles(styles, {withTheme: true})(Dashboard);
