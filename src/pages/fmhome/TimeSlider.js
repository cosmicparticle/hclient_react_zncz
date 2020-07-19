import React from 'react'
import { Slider } from 'antd';

export default class TimeSlider extends React.Component {
    state = {
      value: 0,
    };
  
    handleChange = value => {
      this.setState({ value });
    };
  
    render() {
      const { max, min } = this.props;
      const { value } = this.state;
      const mid = ((max - min) / 2).toFixed(5);
      return (
      
        
          <Slider {...this.props} onChange={this.handleChange} value={value} />
         
      
      );
    }
  }
  