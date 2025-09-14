import React from "react";
import styles from "./SwitchButton.module.css";

const SwitchButton = ({ checked, onChange, data_cy }) => {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        data-cy={data_cy}
      />
      <span className={styles.slider}></span>
    </label>
  );
};

export default SwitchButton;
