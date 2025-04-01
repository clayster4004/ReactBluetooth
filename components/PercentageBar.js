import { useEffect, useState } from "react";

export default function PercentageBar({ percentage, color }) {
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    // Trigger the transition after a slight delay
    const timeout = setTimeout(() => setFillWidth(percentage), 100);
    return () => clearTimeout(timeout);
  }, [percentage]);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ddd",
        borderRadius: "8px",
        overflow: "hidden",
        height: "20px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          width: `${fillWidth}%`,
          backgroundColor: color,
          height: "100%",
          transition: "width 1.5s ease-in-out",
        }}
      ></div>
    </div>
  );
}
