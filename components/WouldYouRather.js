import styles from '../styles/wouldYouRather.module.css';

const WouldYouRather = ({ text, onSelect }) => {
  return (
    <div className={styles.wor}>
      <h1>{text}</h1>
      <button className={styles.selectButton} onClick={onSelect}>
        Select
      </button>
    </div>
  );
};

export default WouldYouRather;
