import React from "react";

const CustomSelector = ({ options, selectedOptions, setOptions }) => {
  const handleOptionClick = (option) => {
    setOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((g) => g !== option) // Deselect if already selected
        : [...prevOptions, option] // Select if not already selected
    );
  };

  return (
    <div className="custom-selector">
      {options.map((option) => (
        <div
          key={option}
          className={`custom-selector__option ${
            selectedOptions.includes(option) ? "selected" : ""
          }`}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default CustomSelector;
