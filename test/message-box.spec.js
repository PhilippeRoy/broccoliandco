import 'jsdom-global/register';

import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import React from 'react';
import MessageBox from '../src/components/message-box';
import { Button } from 'react-bootstrap';


describe('MessageBox', () => {
  it('should render', () => {
    const wrapper = shallow(<MessageBox/>);
    expect(wrapper).to.have.length(1);
  });
  it('should render a h2 tag with the text from the title prop', () => {
    const title = "A title"
    const props = { title:title }
    const wrapper = mount(<MessageBox {...props}/>);
    expect(wrapper.containsMatchingElement(<h2>{title}</h2>)).to.equal(true);
  });
  it('should render a p tag with the text from the msg prop', () => {
    const msg = "a msg";
    const props = { msg:msg }
    const wrapper = mount(<MessageBox {...props}/>);
    expect(wrapper.containsMatchingElement(<p>{msg}</p>)).to.equal(true);
  });
  it('should render a Button component', () => {
    const wrapper = shallow(<MessageBox/>);
    expect(wrapper.find(Button)).to.have.length(1);
  });
  it('should take an onClick callback prop', () => {
    const wrapper = mount(<MessageBox />);
    expect(typeof wrapper.props().onClick === 'function').to.equal(true);
  });
  it('should pass onClick prop callback to Button', ()=>{
    const wrapper = mount(<MessageBox />);
    const fn1 = wrapper.props().onClick;
    const fn2 = wrapper.find(Button).props().onClick;
    // test to see if both contain the same function references
    expect(fn1).to.equal(fn2);
  });

});
