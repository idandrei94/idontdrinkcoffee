import React from 'react';
import styles from '@/styles/Banner.module.css';

interface Props {
  buttonText: string;
  handleOnClick: () => void;
  showbutton: boolean;
  isLoading: boolean;
}

const Banner: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Idont</span>
        <span className={styles.title2}>drinkcoffee</span>
      </h1>
      <p className={styles.subTitle}>
        Discover stuff you don&apos;t really care about
      </p>
      {props.showbutton && (
        <button
          className={styles.button}
          onClick={props.handleOnClick}
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Loading...' : props.buttonText}
        </button>
      )}
    </div>
  );
};

export default Banner;
