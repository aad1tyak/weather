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

  const location = {
    San_deiago: "34.0463732,-116.7161478",
    new_york: "40.6971415,-73.979506",
  };

  const loadForecast = (location) => {
    axios
      .get(`https://api.weather.gov/points/${location}`)
      .then((resWeather) => {
        axios.get(resWeather.data.properties.forecast).then((resForecast) => {
          setCurrentTime(dayjs());
          setForecast(resForecast.data.properties);
          setPeriods(resForecast.data.properties.periods);
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
    console.log(periods);
  };

  return (
    <>
      <a className="button" onClick={updateForecast}>
        Reload the Forecast
      </a>
      <p>{`Last reloaded ${dayjs.duration(currentTime.diff(forecast.generatedAt)).humanize()} ago`}</p>
      {periods.map((period, index) => (
        <Periods {...period} />
      ))}
    </>
  );
}

export const Periods = (period) => {
  return (
    <div className="weather-card">
      <h3>
        {period.name} temperature is {period.temperature}
        {period.temperatureUnit}
      </h3>
    </div>
  );
};

export default App;
