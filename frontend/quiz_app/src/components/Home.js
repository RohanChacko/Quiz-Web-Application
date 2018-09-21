import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import './Home.css'

const styles = {
  root: {
    width: '100%',
    maxWidth: 500,
  },
};

class Home extends Component {

  render() {
    const {classes} = this.props;
    return (<div className="App">
      <header className="App-header">
        <Typography variant="display3" gutterBottom="gutterBottom" className="App-title">Welcome to ma hood. #Logang4lyf #Deadline approachin</Typography>
      </header>
    </div>);
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default Home;
