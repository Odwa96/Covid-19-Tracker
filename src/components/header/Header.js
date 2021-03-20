import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

import InfoBox from "../Stats/InfoBox";
import Table from "../Table/Table";
import Graph from "../Graph/Graph";
import Map from "../Map/Map";

import { sortData, formatedStat } from "../../util";

import "./Header.css";

const Header = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 41.2284, lng: 80.9098 });
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getData();
  }, []);

  const onChange = async (event) => {
    const code = event.target.value;

    setCountry(code);

    const url =
      code === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${code}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(code);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="Main">
      <div className="left">
        <div className="header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="dropdown">
            <Select variant="outlined" onChange={onChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="stats">
          <InfoBox
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={countryInfo.cases}
            cases={formatedStat(countryInfo.todayCases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={countryInfo.recovered}
            cases={formatedStat(countryInfo.todayRecovered)}
          />
          <InfoBox
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={countryInfo.deaths}
            cases={formatedStat(countryInfo.todayDeaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <hr />
          <h3 className="lineGraph">Worldwide new {casesType}</h3>
          <Graph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Header;
