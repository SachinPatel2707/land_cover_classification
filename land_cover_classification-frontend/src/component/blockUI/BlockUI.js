import React from 'react';
import './blockUI.css';

function BlockUI(props) {
  const message = props.message;

  return (
    <div className="block-ui">
      <div className="block-ui-overlay"></div>
      <div className="block-ui-message">{message}</div>
    </div>
  );
}

export default BlockUI;
