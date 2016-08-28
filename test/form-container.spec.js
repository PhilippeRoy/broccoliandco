import 'jsdom-global/register';

import { expect } from 'chai';
import { shallow } from 'enzyme';

import React from 'react';
import FormContainer from '../src/components/form-container';
import { Button, Modal } from 'react-bootstrap';


describe('FormContainer', () => {
  it('should render', () => {
    const wrapper = shallow(<FormContainer/>);
    expect(wrapper).to.have.length(1);
  });
  it('should render a Button component', () => {
    const wrapper = shallow(<FormContainer/>);
    expect(wrapper.find(Button)).to.have.length(1);
  });
  it('should render a Modal component', () => {
    const wrapper = shallow(<FormContainer/>);
    expect(wrapper.find(Modal)).to.have.length(1);
  });
  it('should have init state showModal equal to false', () => {
    const wrapper = shallow(<FormContainer />);
    expect(wrapper.state().showModal).to.equal(false);
  });
  it('should have init state showForm equal to true', () => {
    const wrapper = shallow(<FormContainer />);
    expect(wrapper.state().showForm).to.equal(true);
  });
  it('shound change Modal state to show when the Button is clicked', () => {
    const wrapper = shallow(<FormContainer />);
    const button = wrapper.find(Button);
    button.simulate('click');
    expect(wrapper.state().showModal).to.equal(true);
  });

});
