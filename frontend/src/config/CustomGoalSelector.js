import React from "react";

// Custom goal selector component
const CustomGoalSelector = ({ goalOptions, selectedGoals, setGoals }) => {
  const handleGoalClick = (goal) => {
    // Toggle selection of the goal
    setGoals((prevGoals) =>
      prevGoals.includes(goal)
        ? prevGoals.filter((g) => g !== goal) // Deselect if already selected
        : [...prevGoals, goal] // Select if not already selected
    );
  };

  return (
    <div className="custom-selector">
      {goalOptions.map((goal) => (
        <div
          key={goal}
          className={`custom-selector__option ${
            selectedGoals.includes(goal) ? "selected" : ""
          }`}
          onClick={() => handleGoalClick(goal)}
        >
          {goal}
        </div>
      ))}
    </div>
  );
};

export default CustomGoalSelector;
