import React, { useState } from 'react';

const ModeDropdown = ({ onChange }) => {
  const [selectedMode, setSelectedMode] = useState(1); // Default mode is 1 ("%")

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    onChange(mode);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="modeDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedMode === 1 ? '%' : 'Voix'}
      </button>
      <ul className="dropdown-menu" aria-labelledby="modeDropdown">
        <li>
          <button className="dropdown-item" onClick={() => handleModeChange(1)}>
            %
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleModeChange(2)}>
            Voix
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ModeDropdown;
