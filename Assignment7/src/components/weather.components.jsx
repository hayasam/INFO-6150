import React from "react";
import "weather-icons/css/weather-icons.css";
import "./weather.style.css";

const Weather =(props) =>{
    return (
        <div className='container'>
        <div className="cards">
        <h1>{props.city},{props.country}</h1>
        <h5 className="py-4">
        <i className={`wi ${props.weatherIcon} display-1`}/>
        </h5>
        <h1 className="py-2" >{props.temp_celsius}&deg;</h1>
        {maxminTemp(props.temp_min, props.temp_max)}
        <h4 className="py-3">
        {props.description}
        </h4>
        </div>
        </div>
    );
}

export default Weather;

function maxminTemp(min, max) {
    if (max && min) {
      return (
        <h3>
          <span className="px-4">{min}&deg;</span>
          <span className="px-4">{max}&deg;</span>
        </h3>
      );
    }
  }