import 'jsdom-global/register';

import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';

import React from 'react';
import Form from '../src/components/form';
import { Button } from 'react-bootstrap';


describe('Form', () => {
  it('should render', () => {
    const wrapper = shallow(<Form/>);
    expect(wrapper).to.have.length(1);
  });
  it('should render a h2 tag with the text from the title prop', () => {
    const title = "A title"
    const props = { title:title }
    const wrapper = mount(<Form {...props}/>);
    expect(wrapper.containsMatchingElement(<h2>{title}</h2>)).to.equal(true);
  });
  it('should render a form tag with an action prop', () => {
    const action = "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth";
    const props = { action:action }
    const wrapper = shallow(<Form {...props}/>);
    expect(wrapper.prop('action')).to.equal(action);
  });
  it('should render a form tag with an method prop', () => {
    const method = "POST";
    const props = { method:method }
    const wrapper = shallow(<Form {...props}/>);
    expect(wrapper.prop('method')).to.equal(method);
  });
  it('should render a Button component', () => {
    const wrapper = shallow(<Form/>);
    expect(wrapper.find(Button)).to.have.length(1);
  });
  it('should pass a submit handler to button', () => {
    const wrapper = shallow(<Form/>);
    const button = wrapper.find(Button);
    const handleSubmit = wrapper.instance()._handleSubmit;
    expect(button.prop('onClick')).to.eql(handleSubmit);
  });
  // Fields
  it('should contain and a fields object in state that has a property name', () => {
    const wrapper = shallow(<Form/>);
    expect(wrapper.state().fields.hasOwnProperty('name')).to.equal(true);
  });
  it('should contain and a fields object in state that has a property email)', () => {
    const wrapper = shallow(<Form/>);
    expect(wrapper.state().fields.hasOwnProperty('email')).to.equal(true);
  });
  it('should contain and a fields object in state that has a property emailConfirm', () => {
    const wrapper = shallow(<Form/>);
    expect(wrapper.state('fields').hasOwnProperty('emailConfirm')).to.equal(true);
  });
  it('should contain and a fields object in state which each property is an object that contains an empty value and a "hasError" property equal to null', () => {
    const wrapper = shallow(<Form/>);
    for (var field in wrapper.state().fields) {
      expect(wrapper.state().fields[field]).to.eql({
        value: '',
        hasError : null
      });
    }
  });
});
