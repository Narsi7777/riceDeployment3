import React, { useState } from "react";
import "./POpUp.css";

const PopUp = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = () => {
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000); // Popup will disappear after 3 seconds
  };

  return (
    <div className="App">
      <button onClick={showPopup} className="popup-button">
        Show Popup
      </button>

      {isPopupVisible && (
        <div className="popup-top">
          <p>This is a popup message!</p>
        </div>
      )}
    </div>
  );
};

export default PopUp;