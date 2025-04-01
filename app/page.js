// "use client";

// import { useState } from "react";
// import styles from '../styles/page.module.css';
// import WouldYouRather from "../components/WouldYouRather";

// // https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/libraries/bluetooth/services/nus.html
// // The Service ID and TX ID are needed for bluetooth communication from the device to the web app
// const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
// const TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// const questions = [
//   {
//     option1: "be able to eat anything you want, and not gain weight",
//     option2: "only have to sleep 1 hour per day to feel fully rested"
//   },
//   {
//     option1: "Option 1 text for question 2",
//     option2: "Option 2 text for question 2"
//   }
// ];

// async function connectBluefruit(onMessageReceived) {
//   try {
//     const device = await navigator.bluetooth.requestDevice({
//       filters: [{ name: "CIRCUITPY3073" }],
//       optionalServices: [UART_SERVICE_UUID],
//     });
//     const server = await device.gatt.connect();
//     const service = await server.getPrimaryService(UART_SERVICE_UUID);
//     const txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID);

//     await txCharacteristic.startNotifications();
//     txCharacteristic.addEventListener("characteristicvaluechanged", (event) => {
//       const value = event.target.value;
//       const decoder = new TextDecoder("utf-8");
//       const message = decoder.decode(value);
//       console.log("Received message:", message);
//       // Normalize the message to determine which button was pressed
//       const lowerMsg = message.toLowerCase();
//       if (lowerMsg.includes("a") || lowerMsg.includes("left")) {
//         onMessageReceived("left");
//       } else if (lowerMsg.includes("b") || lowerMsg.includes("right")) {
//         onMessageReceived("right");
//       }
//     });
//     return device;
//   } catch (error) {
//     console.error("Error connecting to Bluefruit device:", error);
//   }
// }

// export default function Page() {
//   const [status, setStatus] = useState("Not connected");
//   const [messages, setMessages] = useState([]);
//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState([]);

//   // This function saves the selected answer and moves to the next question
//   const handleDecision = (side) => {
//     // Determine the answer based on side ("left" for option1, "right" for option2)
//     const chosenAnswer = side === "left" 
//       ? questions[questionIndex].option1 
//       : questions[questionIndex].option2;
    
//     // Save the answer
//     setAnswers(prev => [...prev, chosenAnswer]);
//     console.log(`User selected (${side}):`, chosenAnswer);
    
//     // Move to the next question if available
//     setQuestionIndex(prevIndex => {
//       const nextIndex = prevIndex + 1;
//       // Optionally, you can add a check to see if the next question exists
//       return nextIndex < questions.length ? nextIndex : prevIndex;
//     });
//   };

//   // Handler for when the Bluetooth device sends a message
//   const handleBluetoothMessage = (side) => {
//     setMessages(prev => [...prev, side]);
//     handleDecision(side);
//   };

//   const handleConnect = async () => {
//     setStatus("Connecting...");
//     const device = await connectBluefruit(handleBluetoothMessage);
//     if (device) {
//       setStatus(`Connected to ${device.name}`);
//     } else {
//       setStatus("Connection failed");
//     }
//   };

//   // Handlers for clicking on the UI components directly
//   const handleSelectOption = (side) => {
//     handleDecision(side);
//   };

//   return (
//     <div className={styles["whole-page"]}>
//       <div className={styles.header}>
//         <div className={styles.controls}>
//           <h3>Controls</h3>
//           <p>A: Selects Left Option</p>
//           <p>B: Selects Right Option</p>
//         </div>
//         <div className={styles.welcome}>
//           <div>
//             <h2>Welcome to Would you Rather: Bluefruit Edition</h2>
//           </div>
//           <div>
//             <h2>Would You Rather...</h2>
//           </div>
//         </div>
//         <div className={styles.connect}>
//           <p>Connect</p>
//           <button onClick={handleConnect}>Connect Device</button>
//           <p>{status}</p>
//         </div>
//       </div>

//       <div className={styles.game}>
//         <div className={styles["game-body"]}>
//           <div className={styles.optionBlue} onClick={() => handleSelectOption("left")}>
//             <WouldYouRather text={questions[questionIndex].option1} />
//           </div>
//           <div className={styles.optionRed} onClick={() => handleSelectOption("right")}>
//             <WouldYouRather text={questions[questionIndex].option2} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

"use client";

import { useState } from "react";
import styles from "../styles/page.module.css";
import WouldYouRather from "../components/WouldYouRather";
import PercentageBar from "../components/PercentageBar";

// Hard-coded questions with percentage data for left/right options
const questions = [
  {
    option1: "be able to eat anything you want, and not gain weight",
    option2: "only have to sleep 1 hour per day to feel fully rested",
    percentages: { left: 70, right: 30 },
  },
  {
    option1: "Option 1 text for question 2",
    option2: "Option 2 text for question 2",
    percentages: { left: 40, right: 60 },
  },
];

async function connectBluefruit(onMessageReceived) {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "CIRCUITPY3073" }],
      optionalServices: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"],
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    const txCharacteristic = await service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");

    await txCharacteristic.startNotifications();
    txCharacteristic.addEventListener("characteristicvaluechanged", (event) => {
      const value = event.target.value;
      const decoder = new TextDecoder("utf-8");
      const message = decoder.decode(value);
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes("a") || lowerMsg.includes("left")) {
        onMessageReceived("left");
      } else if (lowerMsg.includes("b") || lowerMsg.includes("right")) {
        onMessageReceived("right");
      }
    });
    return device;
  } catch (error) {
    console.error("Error connecting to Bluefruit device:", error);
  }
}

export default function Page() {
  const [status, setStatus] = useState("Not connected");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Save answer and show results when an option is selected
  const handleDecision = (side) => {
    const chosenAnswer =
      side === "left"
        ? questions[questionIndex].option1
        : questions[questionIndex].option2;

    setAnswers((prev) => [...prev, chosenAnswer]);
    setShowResults(true);
  };

  // Bluetooth message handler
  const handleBluetoothMessage = (side) => {
    handleDecision(side);
  };

  const handleConnect = async () => {
    setStatus("Connecting...");
    const device = await connectBluefruit(handleBluetoothMessage);
    if (device) {
      setStatus(`Connected to ${device.name}`);
    } else {
      setStatus("Connection failed");
    }
  };

  // Handler for direct user clicks
  const handleSelectOption = (side) => {
    handleDecision(side);
  };

  // Advances to the next question and hides the results
  const handleNextQuestion = () => {
    setShowResults(false);
    setQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const currentQuestion = questions[questionIndex];

  return (
    <div className={styles["whole-page"]}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <p>Controls</p>
        </div>
        <div className={styles.welcome}>
          <h2>Welcome to Would you Rather: Bluefruit Edition</h2>
          <h2>Would You Rather...</h2>
        </div>
        <div className={styles.connect}>
          <p>Connect</p>
          <button onClick={handleConnect}>Connect Device</button>
          <p>{status}</p>
        </div>
      </div>

      <div className={styles.game}>
        <div className={styles["game-body"]}>
          <div
            className={styles.optionBlue}
            onClick={() => handleSelectOption("left")}
          >
            <WouldYouRather text={currentQuestion.option1} />
          </div>
          <div
            className={styles.optionRed}
            onClick={() => handleSelectOption("right")}
          >
            <WouldYouRather text={currentQuestion.option2} />
          </div>
        </div>

        {showResults && (
          <div style={{ padding: "20px" }}>
            <h3>Results</h3>
            <div>
              <p>
                {currentQuestion.option1}: {currentQuestion.percentages.left}%
              </p>
              <PercentageBar
                percentage={currentQuestion.percentages.left}
                color="blue"
              />
            </div>
            <div>
              <p>
                {currentQuestion.option2}: {currentQuestion.percentages.right}%
              </p>
              <PercentageBar
                percentage={currentQuestion.percentages.right}
                color="red"
              />
            </div>
            <button onClick={handleNextQuestion}>Next Question</button>
          </div>
        )}
      </div>
    </div>
  );
}

