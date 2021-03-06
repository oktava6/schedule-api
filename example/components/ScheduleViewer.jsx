import React, { PureComponent } from 'react';

import { findById } from '../../src/utils';
import data from '../data';

export default class ScheduleViewer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      isShown: false,
      loadValue: JSON.stringify(data),
    }
  }

  handleFilterSubmit = (event, type) => {
    event.preventDefault();

    const id = event.target.id.value;
    const dateStart = event.target.dateStart.value;
    const dateEnd = event.target.dateEnd.value;

    const events = type === 'school' ? this.props.getEventsBySchoolAndDates(id, dateStart, dateEnd) :
      this.props.getEventsByRoomAndDates(id, dateStart, dateEnd);

    this.setState({ events, isShown: true });
  };

  handleClose = () => this.setState({ isShown: false });

  handleLoadChange = event => this.setState({ loadValue: event.target.value });

  handleImportClick = (event) => {
    event.preventDefault();

    this.props.importData(this.state.loadValue)
      .then(() => alert('Success!'))
      .catch(error => alert(`Error: ${error}`));
  };

  handleExportClick = (event) => {
    event.preventDefault();

    this.setState({ loadValue: this.props.exportData() });
  };

  render() {
    const { rooms, schools } = this.props;
    const { events, isShown, loadValue } = this.state;
    let scheduleItems = [];

    if (isShown) {
      scheduleItems = events.map((event, key) => {
        const room = findById(rooms, event.room) || {};
        const foundSchools = findById(schools, event.schools) || [];

        return (
          <div key={key} style={{ marginBottom: '20px' }}>
            name: {event.name}; <br />
            lecturer: {event.lecturer}; <br />
            starts: {new Date(event.dateStart).toString()}; <br />
            ends: {new Date(event.dateEnd).toString()}; <br />
            room: {room.name} ({room.location}), {room.seats} seats; <br />
            schools: {foundSchools.map((school, key) => <span key={key}>{school.name} (school.amount), </span>)}
          </div>
        );
      });
    }

    return (
      <div>
        <h2>Data viewer</h2>
        <h3>Show schedule by school and date range</h3>
        <form onSubmit={e => this.handleFilterSubmit(e, 'school')}>
          <label>choose school</label>
          <select name="id">
            { schools.map((school, key) => (
              <option value={school.id} key={key}>{school.name}</option>
            )) }
          </select>
          <label>date start</label><input type="text" name="dateStart" placeholder="yyyy-mm-dd hh:mm" />
          <label>date end</label><input type="text" name="dateEnd" placeholder="yyyy-mm-dd hh:mm" /><br />
          <button>Show schedule</button>
        </form>

        <h3>Show schedule by room and date range</h3>
        <form onSubmit={e => this.handleFilterSubmit(e, 'room')}>
          <label>choose room</label>
          <select name="id">
            { rooms.map((room, key) => (
              <option value={room.id} key={key}>{room.name}</option>
            )) }
          </select>
          <label>date start</label><input type="text" name="dateStart" placeholder="yyyy-mm-dd hh:mm" />
          <label>date end</label><input type="text" name="dateEnd" placeholder="yyyy-mm-dd hh:mm" /><br />
          <button>Show schedule</button>
        </form>

        <h2>Import/export JSON model</h2>
        <form>
          <textarea className="loadTextarea" name="payload"rows="4" value={loadValue} onChange={this.handleLoadChange} /><br />
          <button onClick={this.handleImportClick}>Import data from textarea</button>
          <button onClick={this.handleExportClick}>Export data to textarea</button>
        </form>

        <div className="scheduleWrapper" style={{ display: isShown ? 'block' : 'none' }}>
          <button className="closeButton" onClick={this.handleClose}>Close</button>
          <div className="schedule">
            {scheduleItems.length > 0 ? scheduleItems : <h2>Any data was found</h2>}
          </div>
        </div>
      </div>
    );
  }
}
