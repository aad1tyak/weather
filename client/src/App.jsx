import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

import "./app.css";

dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);

function App() {
  const [weather, setWeather] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [periods, setPeriods] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [hourly, setHourly] = useState([]);

  const [hourlyView, setHourlyView] = useState(true);

  const location = {
    San_deiago: "34.0463732,-116.7161478",
    new_york: "40.6971415,-73.979506",
  };

  const loadForecast = (location) => {
    axios
      .get(`https://api.weather.gov/points/${location}`)
      .then((resWeather) => {
        setWeather(resWeather.data.properties);
        axios.get(resWeather.data.properties.forecast).then((resForecast) => {
          setCurrentTime(dayjs());
          setForecast(resForecast.data.properties);
          setPeriods(resForecast.data.properties.periods);
        });
        axios
          .get(resWeather.data.properties.forecastHourly)
          .then((resHourlyForecast) => {
            setHourlyForecast(resHourlyForecast.data.properties);
            setHourly(resHourlyForecast.data.properties.periods);
          });
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadForecast(location.new_york);
  }, [
    () => {
      loadForecast(location.new_york);
    },
  ]);

  const updateForecast = () => {
    loadForecast(location.new_york);
    console.log(weather);
    console.log(periods);
  };

  return (
    <>
      <a className="button" onClick={updateForecast}>
        Reload the Forecast
      </a>
      <p>{`Last reloaded ${dayjs.duration(currentTime.diff(forecast.generatedAt)).humanize()} ago`}</p>
      {hourlyView
        ? hourly.map((item, index) => <HourlyPeriods {...item} key={index} />)
        : periods.map((period, index) => <Periods {...period} key={index} />)}
    </>
  );
}

export const Periods = (period) => {
  return (
    <div className="weather-card">
      <h1>{period.shortForecast}</h1>
      <img src={period.icon} />
      <h3>
        {period.name} temperature is {period.temperature}
        {period.temperatureUnit}
      </h3>
      <p>
        Probability Of Precipitation is{" "}
        {period.probabilityOfPrecipitation.value}
      </p>
      <p>
        Wind Speed is {period.windSpeed} moving in {period.windDirection}
      </p>
      <span>{period.detailedForecast}</span>
    </div>
  );
};

export const HourlyPeriods = (hourlyPeriod) => {
  return (
    <div className="weather-card">
      <h1>{hourlyPeriod.shortForecast}</h1>
      <img src={hourlyPeriod.icon} />
      <h3>
        {dayjs(hourlyPeriod.startTime).format("hh A")} to{" "}
        {dayjs(hourlyPeriod.endTime).format("hh A")} temperature is{" "}
        {hourlyPeriod.temperature}
        {hourlyPeriod.temperatureUnit}
      </h3>
      <p>
        Probability Of Precipitation is{" "}
        {hourlyPeriod.probabilityOfPrecipitation.value}
      </p>
      <p>
        Wind Speed is {hourlyPeriod.windSpeed} moving in{" "}
        {hourlyPeriod.windDirection}
      </p>
      <span>{hourlyPeriod.detailedForecast}</span>
    </div>
  );
};

export default App;
