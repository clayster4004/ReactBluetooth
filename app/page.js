// "use client";

// import { useState } from "react";
// import BigButton from "../components/BigButton";

// async function connectBluefruit() {
//   try {
//     const device = await navigator.bluetooth.requestDevice({
//       filters: [{ name: 'CIRCUITPY3073' }],
//       // optionalServices: ['your-service-uuid'] // if known
//     });

//     console.log("Device found:", device.name);

//     const server = await device.gatt.connect();
//     console.log("Connected to GATT server");

//     // If needed, retrieve a service:
//     // const service = await server.getPrimaryService('your-service-uuid');
//     // console.log("Service retrieved:", service);

//     return device;
//   } catch (error) {
//     console.error("Error connecting to Bluefruit device:", error);
//     throw error;
//   }
// }

// export default function Page() {
//   const [status, setStatus] = useState("Not connected");

//   const handleConnect = async () => {
//     setStatus("Connecting...");
//     try {
//       const connectedDevice = await connectBluefruit();
//       if (connectedDevice) {
//         setStatus(`Connected to ${connectedDevice.name}`);
//       }
//     } catch {
//       setStatus("Connection failed");
//     }
//   };

//   return (
//     <div className="whole-page">
//       <h2>React Bluefruit Bluetooth Website</h2>
//       <BigButton text="Connect Bluefruit" onClick={handleConnect} />
//       <p>Status: {status}</p>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import BigButton from "../components/BigButton";

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
// TX characteristic: device -> client notifications
const TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

async function connectBluefruit(onMessageReceived) {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "CIRCUITPY3073" }],
      optionalServices: [UART_SERVICE_UUID],
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(UART_SERVICE_UUID);
    const txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);

    await txCharacteristic.startNotifications();
    txCharacteristic.addEventListener("characteristicvaluechanged", (event) => {
      const value = event.target.value;
      const decoder = new TextDecoder("utf-8");
      const message = decoder.decode(value);
      console.log("Received message:", message);
      // Pass the message back to update the UI
      onMessageReceived(message);
    });

    return device;
  } catch (error) {
    console.error("Error connecting to Bluefruit device:", error);
  }
}

export default function Page() {
  const [status, setStatus] = useState("Not connected");
  const [messages, setMessages] = useState([]);

  const handleConnect = async () => {
    setStatus("Connecting...");
    const device = await connectBluefruit((message) => {
      // Update UI when a message is received
      setMessages((prev) => [...prev, message]);
    });
    if (device) {
      setStatus(`Connected to ${device.name}`);
    } else {
      setStatus("Connection failed");
    }
  };

  return (
    <div className="whole-page">
      <h2>React Bluefruit Bluetooth Website</h2>
      <BigButton text="Connect Bluefruit" onClick={handleConnect} />
      <p>Status: {status}</p>
      <div>
        <h3>Received Messages:</h3>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
