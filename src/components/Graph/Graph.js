import React, { useEffect, useState } from "react";
import numeral from "numeral";
import { Line } from "react-chartjs-2";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltopFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const Graph = ({ casesType = "cases" }) => {
  const [data, setData] = useState({});

  const buildChart = (data, casesType = "cases") => {
    const chartData = [];
    let lastData;

    for (let date in data.cases) {
      if (lastData) {
        const newData = {
          x: date,
          y: data[casesType][date] - lastData,
        };
        chartData.push(newData);
      }
      lastData = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
      ).then((response) =>
        response.json().then((data) => {
          const chartData = buildChart(data, casesType);
          setData(chartData);
        })
      );
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(240, 36, 36, 0.5)",
                borderColor: "#f02424",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default Graph;
