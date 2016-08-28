import React from 'react';
import Update from 'react-addons-update';
import { HelpBlock, FormControl, FormGroup, Button } from 'react-bootstrap';
import Validator from 'validator';
import jQuery from 'jquery';

export default class FormSignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      buttonTxt : "Send",
      errMsg: null,
      fields: {
          name: {
            value: '',
            hasError : null
          },
          email: {
            value: '',
            hasError : null
          },
          emailConfirm: {
            value: '',
            hasError : null
          }
        }
    };
    this._bsErrorVal = this._bsErrorVal.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }
// Handle change from input
  _handleChange(field, e) {
    const newData = Update(this.state, {
         fields: { [field]: { value: {$set: e.target.value} } }
      });
    this.setState(newData);
  }

// Validate field and return an object representing that state
  _validator(field, validatorMethod){
    let newData = {};

    if(validatorMethod){
      newData = { hasError: false };
    } else {
      newData = { hasError: true };
    }

    return Update(this.state.fields[field],{$merge:newData});
  }

  _handleSubmit(){
    const newData = {};
    newData.fields = {}

    // Handle Validation
    newData.fields['name'] = this._validator(
      'name',
      Validator.isLength(this.state.fields.name.value,{min:3})
      );
    newData.fields['email'] = this._validator(
      'email',
      Validator.isEmail(this.state.fields.email.value)
      );
    // Only Validate if email is true
    if(Validator.isEmail(this.state.fields.email.value)){
      newData.fields['emailConfirm'] = this._validator(
        'emailConfirm',
        Validator.equals(this.state.fields.email.value, this.state.fields.emailConfirm.value)
        );
    }

    newData.fields =  Update(this.state.fields,{$merge:newData.fields});
    newData.buttonTxt = "Sending, please wait..."
    this.setState(newData , this._sendFormData);

  }
  _sendFormData(){
    // Loop through to see if all fields are valid
    // escape if not valid
    for (var variable in this.state.fields) {
      if (typeof this.state.fields[variable] === 'object' &&
          this.state.fields[variable].hasOwnProperty('hasError') &&
          this.state.fields[variable].hasError || this.state.fields[variable].hasError === null ) {
        // Set state of button and escape so form isn't set
        this.setState({buttonTxt:"Send"});
        return;
      }
    }

    // Setting the form Data manually becasue we don't want all fields in request
    jQuery.ajax({
      url: this.props.action,
      method: this.props.method,
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify({
        "name":this.state.fields.name.value,
        "email":this.state.fields.email.value
      }),
      cache: false,
      success: function(){
        this.props.onClick();
      }.bind(this),
      error: function(xhr) {
        const response = JSON.parse(xhr.responseText)
        if(response.errorMessage === "Bad Request: Email is already in use"){
          const newData = {};
          newData.fields = {}
          newData.fields['email'] = this._validator( 'email', false);
          newData.fields['emailConfirm'] = this._validator( 'emailConfirm', false);
          newData.fields =  Update(this.state.fields,{$merge:newData.fields});
          newData.buttonTxt = "Send"
          newData.errMsg = response.errorMessage;
          this.setState(newData);
        } else {
          this.setState({buttonTxt:"Send", errMsg: response.errorMessage});
        }
      }.bind(this)
    });

  }

// Set Bootstrap validationState error
  _bsErrorVal(field){
    if(!this.state.fields[field].hasError){
      if(this.state.fields[field].hasError === null ){
        return null
      } else {
        return "success"
      }
    }
    if(this.state.fields[field].hasError){
      return "error"
    }
  }

  render() {
    return (
      <form action={this.props.action} method={this.props.method}>
        <h2>{this.props.title}</h2>
        <hr />
        <FormGroup
          controlId="fullname"
          validationState={this._bsErrorVal('name')}
          >
          <FormControl
            type="text"
            value={this.state.fields.name.value}
            placeholder="Full Name"
            onChange={this._handleChange.bind(this, 'name')}
          />
          <FormControl.Feedback />
          {this.state.fields.name.hasError && this.state.errMsg === null ? <HelpBlock>Name must be three characters long</HelpBlock> : "" }
        </FormGroup>

        <FormGroup
          controlId="email"
          validationState={this._bsErrorVal('email')}
          >
          <FormControl
            type="email"
            value={this.state.fields.email.value}
            placeholder="Email"
            onChange={this._handleChange.bind(this, 'email')}
          />
          <FormControl.Feedback />
          {this.state.fields.email.hasError && this.state.errMsg === null ? <HelpBlock>Must be a valid email</HelpBlock> : ""}
        </FormGroup>

        <FormGroup
          controlId="emailConfirm"
          validationState={this._bsErrorVal('emailConfirm')}
          >
          <FormControl
            type="email"
            value={this.state.fields.emailConfirm.value}
            placeholder="Confirm Email"
            onChange={this._handleChange.bind(this, 'emailConfirm')}
          />
          <FormControl.Feedback />
          {this.state.fields.emailConfirm.hasError && this.state.errMsg === null ? <HelpBlock>Confirm email does not match</HelpBlock> : "" }
        </FormGroup>
        <div className="msg-err">{this.state.errMsg}</div>
        <Button bsStyle="success" bsSize="large" onClick={this._handleSubmit} >
          {this.state.buttonTxt}
        </Button>
      </form>
    );
  }
}

FormSignUp.defaultProps = {
  action: "",
  method: "GET",
  title: ""
};

FormSignUp.propTypes = {
  action: React.PropTypes.string.isRequired,
  method: React.PropTypes.string.isRequired,
  title: React.PropTypes.string
};
