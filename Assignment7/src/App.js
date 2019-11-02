import React from 'react';
import "./App.css";
import "weather-icons/css/weather-icons.css";
import Weather from "./components/weather.components";
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.css";


//api.openweathermap.org/data/2.5/weather?q=London,uk
const Api_key="610ec2fa20f8d13c73a9107b326f8b32";

class App extends React.Component{
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: null,
      temp_min: null,
      description: "",
      error: false
    };
    this.getWeather();

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    };

  }
      calCelsius(temp) {
        let cell = Math.floor(temp - 273.15);
        return cell;
      }

    getWeather = async () => {
      const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Boston,US&appid=${Api_key}`);
        const response=await api_call.json();
        console.log(response);

        this.setState({
          city:response.name,
          country:response.sys.country,
          celsius: this.calCelsius(response.main.temp),
          temp_max: this.calCelsius(response.main.temp_max),
          temp_min: this.calCelsius(response.main.temp_min),
          description: response.weather[0].description,
          icon:this.weatherIcon.Thunderstorm
        })


    };
render(){
  return(
    <div className="App">
    <Weather city={this.state.city}
             country={this.state.country}
             temp_celsius={this.state.celsius}
             temp_max={this.state.temp_max}
             temp_min={this.state.temp_min}
             description={this.state.description}
             weatherIcon={this.state.icon}
             
             />
    </div>
  );
}
}


export default App;
