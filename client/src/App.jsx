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

  const [selectedPeriodCard, setSelectedPeriodCard] = useState([]);
  const [selectedHourlyCard, setSelectedHourlyCard] = useState([]);

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
          setSelectedPeriodCard(resForecast.data.properties.periods[0]);
        });
        axios
          .get(resWeather.data.properties.forecastHourly)
          .then((resHourlyForecast) => {
            setHourlyForecast(resHourlyForecast.data.properties);
            setHourly(resHourlyForecast.data.properties.periods);
            setSelectedHourlyCard(resHourlyForecast.data.properties.periods[0]);
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

  const changeForecastType = () => {
    setHourlyView(!hourlyView);
  };

  const changeMainCard = () => {};
  return (
    <>
      <img
        src="../media/reload-svgrepo.svg"
        width="30"
        onClick={updateForecast}
      />
      <span
        style={{ padding: 10 }}
      >{`Last reloaded ${dayjs.duration(currentTime.diff(forecast.generatedAt)).humanize()} ago`}</span>
      <a className="button" onClick={changeForecastType}>
        {hourlyView ? "Show period Forecast" : "Show hourly Forecast"}
      </a>
      {hourlyView ? (
        <SelectedCard
          selectedCard={selectedHourlyCard}
          hourlyView={hourlyView}
        />
      ) : (
        <SelectedCard
          selectedCard={selectedPeriodCard}
          hourlyView={hourlyView}
        />
      )}
      {hourlyView
        ? hourly.map((item, index) => (
            <Forecasts
              periods={item}
              key={index}
              onClick={() => {
                changeMainCard(item);
              }}
            />
          ))
        : periods.map((item, index) => (
            <Forecasts
              periods={item}
              key={index}
              onClick={() => {
                changeMainCard(item);
              }}
            />
          ))}
    </>
  );
}

export const Forecasts = ({ periods }) => {
  return (
    <div className="cards">
      <p className="cards-name">
        {periods.name === ""
          ? dayjs(periods.startTime).format("hh A") +
            "-" +
            dayjs(periods.endTime).format("hh A")
          : periods.name}
      </p>
    </div>
  );
};

export const SelectedCard = ({ selectedCard, hourlyView }) => {
  return (
    <div>
      <h1>
        {selectedCard.temperature}
        {selectedCard.temperatureUnit}
      </h1>
      <p>
        {hourlyView
          ? dayjs(periods.startTime).format("hh A") +
            "-" +
            dayjs(periods.endTime).format("hh A")
          : periods.name}{" "}
      </p>
      <div className="wind-card"></div>
      <div className="precipitation-card"></div>
      {hourlyView && (
        <div>
          <div className="humidity-card"></div>
          <div className="dewpoint-card"></div>
        </div>
      )}
    </div>
  );
};

export const SelectedCardHourly = ({ selectedCard }) => {
  return (
    <div className="main-card">
      <h1>
        {selectedCard.temperature}
        {selectedCard.temperatureUnit}
      </h1>
      <div className="wind-card"></div>
      <div className="precipitation-card"></div>
      <div className="humidity-card"></div>
      <div className="dewpoint-card"></div>
    </div>
  );
};

export const SelectedCardPeriod = ({ selectedCard }) => {
  return (
    <div className="main-card">
      <h1>
        {selectedCard.temperature}
        {selectedCard.temperatureUnit}
      </h1>
      <div className="wind-card"></div>
      <div className="precipitation-card"></div>
    </div>
  );
};

export default App;
