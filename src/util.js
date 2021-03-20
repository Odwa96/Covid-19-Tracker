import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const caseColors = {
  cases: {
    hex: "#3ed124",
    multiplier: 800,
  },
  recovered: {
    hex: "#2470bd",
    multiplier: 1200,
  },
  deaths: {
    hex: "#f02424",
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const formatedStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showMapData = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={caseColors[casesType].hex}
      fillColor={caseColors[casesType].hex}
      radius={Math.sqrt(country[casesType]) * caseColors[casesType].multiplier}
    >
      <Popup>
        <div className="container">
          <div
            className="flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="name">{country.country}</div>
          <div className="confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
