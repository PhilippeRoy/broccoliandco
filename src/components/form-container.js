import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Form from './form';
import MessageBox from './message-box'

// The component includes the modal
export default class FormContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showModal: false,
      showForm: true
    };
    this._close = this._close.bind(this);
    this._open = this._open.bind(this);
    this._hide = this._hide.bind(this);
  }
  _close() {
    this.setState({ showModal: false });
  }
  _open() {
    this.setState({ showModal: true, showForm: true });
  }
  _hide() {
    this.setState({showForm: false});
  }

  render() {

    let modalContent;
    if (this.state.showForm) {
     modalContent = <Form onClick={this._hide} action="https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth" method="POST" title="Request an invite"/>
    } else {
     modalContent = (
       <MessageBox
        title="All done!"
        msg="You will be one of the first to experience Broccoli &amp; Co when we launch."
        onClick={this._close}
        />
      )
    }

    return (
      <div>
        <div className="promo">
          <h2>A better way <br />to enjoy every day</h2>
          <p>Be the first to know when we launch.</p>
          <Button bsStyle="warning" bsSize="large" onClick={this._open} >
            Request an invite
          </Button>
        </div>

        <Modal show={this.state.showModal} onHide={this._close} onExited={this.hide}>
          <Modal.Body>
            {modalContent}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
