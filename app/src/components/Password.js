// Input Component
import React from "react";
import PropTypes from "prop-types";

const Password = ({ label, onInput, value }) => {
  return (
    <div className="input-box">
      <span className="label">{label}</span>
      <input type="password" onChange={onInput} value={value} />
    </div>
  );
};

Password.propTypes = {
  label: PropTypes.string.isRequired,
  onInput: PropTypes.func,
};

export default Password;
