
import React, {useState } from 'react'

import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css'
import MapComponent from './map_component';
import './styles.css'
 
const Index = () => {
  const [startDate, setStartDate] = useState();
  return (
    <div>
      <div className='header'>
        <h1>Welcome to the example task!</h1>
      </div>
      {/* TODO(Task 2): Add a slider to select datetime in the past.
        Pass the selected value as prop to the MapContainer */ }
      <div className="form-group">
      <label >Search for driver location: &#20;</label> 
    <DatePicker
      showTimeSelect
      selected={startDate}
      timeFormat="HH:mm"
      timeIntervals={15}
      onChange={date => setStartDate(date)}
      timeCaption="time"
      dateFormat="MMMM d, yyyy h:mm aa"
      placeholderText="please select a date"
      className="date-picker"
      maxDate={new Date()}
    />
    </div>
    <MapComponent when={startDate} />
    </div>)
}

ReactDOM.render(<Index />, document.getElementById('main-container'))
