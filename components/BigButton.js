"use client";
import styles from "../styles/BigButton.module.css"; // Adjust path as needed


export default function BigButton({ text, onClick }) {
  return (
    <button className={styles.BigButton} onClick={onClick}>
      {text}
    </button>
  );
}