import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

function DoughnutChart(props) {
  const chartRef = useRef();

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    const { data, labels } = props;
    const backgroundColors = [
        "#FF6384",
        "#FFCE56",
        "#2ecc71",
      ]

    let myChart = new Chart(myChartRef, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors
          }
        ],
        labels: labels
      },
      options: {
        borderWidth: 10,
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 2,
        hoverBorderWidth: 0,
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [props]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}

export default DoughnutChart;
