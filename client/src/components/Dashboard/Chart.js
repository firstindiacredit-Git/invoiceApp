import React from "react";
import ReactApexChart from "react-apexcharts";

function Chart({ paymentHistory }) {
  // Create arrays to hold payment dates and amounts
  const paymentDates = paymentHistory.map((payment) => {
    const newDate = new Date(payment.datePaid);
    return newDate.toLocaleDateString(); // Format date
  });

  const paymentReceived = paymentHistory.map((payment) => payment.amountPaid); // Extract amounts

  const series = [
    {
      name: "Payment Received",
      data: paymentReceived,
    },
  ];

  const options = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "category", // Changed from 'datetime' to 'category' for better alignment
      categories: paymentDates, // Pass the dates here
    },
    tooltip: {
      x: {
        format: "dd/MM/yy", // Tooltip format (optional)
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "10%", // Adjust the width of the bars
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
        width: "90%",
        margin: "10px auto",
        padding: "10px",
      }}
    >
      <br />
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
}

export default Chart;
