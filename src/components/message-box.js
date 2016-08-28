import React from 'react';
import { Button } from 'react-bootstrap';

// This will can be a statelss component
// Learn how after

const MessageBox = (props) => (
  <div className="message-box success">
    <h2>{props.title}</h2>
    {props.title !== "" ? <hr /> : ""}
    <p>{props.msg}</p>
    <Button bsStyle="success" bsSize="large" onClick={props.onClick}>
      Ok
    </Button>
  </div>
);

MessageBox.defaultProps = {
  title: "",
  msg: "",
  onClick: ()=>{}
};

MessageBox.propTypes = {
  title: React.PropTypes.string,
  msg: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired
};

export default MessageBox;
