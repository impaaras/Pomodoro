import React, { useEffect, useRef, useState } from "react";
import "./Pie.css";
import { RadialChart } from "react-vis";
const PieChart = ({ userTasksArray }) => {
  const chartData = userTasksArray.map((user) => ({
    angle: user.count,
    // label: user.name,
  }));
  return (
    <div>
      <RadialChart data={chartData} width={100} height={100} showLabels />
    </div>
  );
};

export default PieChart;
