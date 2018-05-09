import React from 'react';
import { InputNumber, Select } from 'antd';

const Option = Select.Option;

class Period extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: 1, unit: 'DAY' };
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onUnitChange = this.onUnitChange.bind(this);
  }

  onNumberChange(value) {
    const { unit } = this.state;
    this.setState({ value });
    this.props.onChange({ value, unit });
  }

  onUnitChange(unit) {
    const { value } = this.state;
    this.setState({ unit });
    this.props.onChange({ value, unit });
  }

  render() {
    return (
      <div>
        <InputNumber
          min={1}
          step={1}
          defaultValue={1}
          onChange={this.onNumberChange}
        />
        <Select
          style={{ width: '80px' }}
          onChange={this.onUnitChange}
          defaultValue={'DAY'}
        >
          <Option value={'DAY'}>日</Option>
          <Option value={'WEEK'}>周</Option>
          <Option value={'MONTH'}>月</Option>
        </Select>
      </div>
    );
  }
}

export default Period;
