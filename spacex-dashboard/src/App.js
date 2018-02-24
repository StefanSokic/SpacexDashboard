import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import logo from './space.svg'

class App extends Component {
  constructor() {
    super();
    this.state = {
      date: "",
      rocketName: "",
      flightNumber: "",
      details: "",
      errorMsg: "",
      value: "",
      latestLaunch: true,
      payloadType: "",
      payloadId: ""
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getFlightById = this.getFlightById.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
  }

  componentDidMount() {
    axios.get('https://api.spacexdata.com/v2/launches/upcoming')
      .then((response) => {
        this.updateInfo(response)
      })
      .catch((error) => {
        this.setState({errorMsg: "An Error occurred!"})
        console.log('error', error)
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  updateInfo(response) {
    if (response.data.length > 0) {
      let launch = response.data[0]
      this.setState({
        rocketName: launch.rocket.rocket_name,
        flightNumber: launch.flight_number,
        details: launch.details,
        date: launch.launch_date_utc,
        payloadType: launch.rocket.second_stage.payloads[0].payload_type,
        payloadId: launch.rocket.second_stage.payloads[0].payload_id
      })
    } else {
      this.setState({errorMsg: "There are no upcoming launches"})
    }
  }

  getFlightById() {
    axios.get('https://api.spacexdata.com/v2/launches?flight_number=' + this.state.value)
      .then((response) => {
        this.updateInfo(response)
      })
      .catch((error) => {
        this.setState({errorMsg: "An Error occurred!"})
        console.log('error', error)
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <input placeholder="Search for a flight by ID" value={this.state.value} onChange={this.handleChange}></input>
          <br></br>
          <button onClick={this.getFlightById}>&#8595;</button>
        </div>
        <div className="container">
          <div className="content">
            <div className="ImgContainer">
              <img alt="rocket" src={logo} />
            </div>
            <h5>Name</h5>
            <p>{this.state.rocketName}</p>
            <h5>Flight Number</h5>
            <p>{this.state.flightNumber}</p>
            <h5> Date and Time</h5>
            <p>{this.state.date.split('T')[0]} at {this.state.date.split('T')[1]}</p>
            <h5>Payload</h5>
            <p>{this.state.payloadId} {this.state.payloadType}</p>
            <h5>Details</h5>
            <p>{this.state.details}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
