import React, { useEffect, useRef, useState } from "react";
import "./Pie.css";
import { RadialChart } from "react-vis";
const PieChart = ({ userTasksArray }) => {
  const totalTasks = userTasksArray.reduce(
    (total, user) => total + user.count,
    0
  );
  const chartData = userTasksArray.map((user) => ({
    angle: user.count,
    label: `${user.name} (${user.count} - ${(
      (user.count / totalTasks) *
      100
    ).toFixed(2)}%)`,
  }));

  const labelStyle = {
    fontSize: "5px", // Adjust the font size as desired
  };
  const percentageStyle = {
    fontSize: "10px", // Adjust the font size of the percentage
  };

  return (
    <div>
      <RadialChart
        data={chartData}
        width={220}
        height={220}
        showLabels
        labelStyle={labelStyle}
        labelsRadiusMultiplier={1.2}
        labelsStyle={{ ...percentageStyle, textAnchor: "middle" }}
      />
    </div>
  );
};

export default PieChart;
