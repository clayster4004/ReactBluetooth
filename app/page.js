// Clays Cool Application
"use client";

import { useState } from "react";
import styles from '../styles/page.module.css';
import WouldYouRather from "../components/WouldYouRather";

// https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/libraries/bluetooth/services/nus.html
// The Service ID and TX ID are needed for bluetooth commuinication from the device to the web app
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const questions = [
  {
    option1: "be able to eat anything you want, and not gain weight",
    option2: "only have to sleep 1 hour per day to feel fully rested"
  },
  {
    option1: "Option 1 text for question 2",
    option2: "Option 2 text for question 2"
  }
];


// async function that accepts a callback as a param
async function connectBluefruit(onMessageReceived) {
  try {
    // Define the device as the request of my specific device using the Web API
    const device = await navigator.bluetooth.requestDevice({
      // This will work with my specific device
      filters: [{ name: "CIRCUITPY3073" }],
      optionalServices: [UART_SERVICE_UUID],
    });

    // This is important for reading/writing data
    const server = await device.gatt.connect();
    // Enables serial communication over Bluetooth
    const service = await server.getPrimaryService(UART_SERVICE_UUID);
    // Needed to send data from device to client (webpage)
    const txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);

    // Enables notifications (sending updates automatically to the app when values change)
    await txCharacteristic.startNotifications();
    // This essentailly listens for changes, when a value is received, decode it and print it out
    txCharacteristic.addEventListener("characteristicvaluechanged", (event) => {
      const value = event.target.value;
      const decoder = new TextDecoder("utf-8");
      const message = decoder.decode(value);
      console.log("Received message:", message);
      // Pass the message back to update the UI
      onMessageReceived(message);
    });

    // Return the device object
    return device;
  } catch (error) {
    console.error("Error connecting to Bluefruit device:", error);
  }
}

export default function Page() {
  // State that takes care of the connection status and messages received
  const [status, setStatus] = useState("Not connected");
  const [messages, setMessages] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  let questionIndex = 0;

  // This is the function called when the connection button is clicked
  const handleConnect = async () => {
    // Status is immediately changed to connecting
    setStatus("Connecting...");
    // Calls the connectBluefruit function
    const device = await connectBluefruit((message) => {
      // Add the message to the UI for debugging
      setMessages((prev) => [...prev, message]);
      // Convert message to lower case for a case-insensitive check
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes("a")) {
        // Simulate clicking the left button
        handleDecision("Click the left side");
      } else if (lowerMsg.includes("b")) {
        // Simulate clicking the right button
        handleDecision("Click the right side");
      }
    });
    if (device) {
      setStatus(`Connected to ${device.name}`);
    } else {
      setStatus("Connection failed");
    }
  };

  const handleSelectOption = (side) => {
    setSelectedOption(side);
    console.log(`User selected: ${side}`);
    // You can add further logic here
  };

  return (
    <div className={styles["whole-page"]}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <p>Controls</p>
        </div>
        <div className={styles.welcome}>
          <div>
            <h2>Welcome to Would you Rather: Bluefruit Edition</h2>
          </div>
          <div>
            <h2>Would You Rather...</h2>
          </div>
          <div>

          </div>
        </div>
        <div className={styles.connect}>
          <p>Connect</p>
          <button onClick={handleConnect}>Connect Device</button>
          <p>{status}</p>
        </div>
      </div>


      <div className={styles.game}>
        <div className={styles["game-body"]}>
          <WouldYouRather text={questions[questionIndex].option1}
          />
          <WouldYouRather text={questions[questionIndex].option2}
          />
        </div>
      </div>
    </div>
  );
}
