import React from 'react';
import { Menu, Dropdown, Input } from 'antd';

const Search = Input.Search;
const MenuItem = Menu.Item;

class UserSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, value: '' };
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onVisibleChange(visible) {
    this.setState({ visible });
  }

  onFocus() {
    this.setState({ visible: true });
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  onSelect({ key }) {
    this.props.onChangeUser(key);
    this.setState({ visible: false });
  }

  render() {
    const { user, children, disabled = false } = this.props;
    const { visible, value } = this.state;

    const menu =
      value === ''
        ? user.map((p, ind) => <MenuItem key={p.id}>{p.name}</MenuItem>)
        : user
            .filter(t => t.name.includes(value))
            .map((p, ind) => <MenuItem key={p.id}>{p.name}</MenuItem>);

    return (
      <Dropdown
        disabled={disabled}
        trigger={['click']}
        placement="bottomRight"
        visible={visible}
        onVisibleChange={this.onVisibleChange}
        overlay={
          <div>
            <Search onClick={this.onFocus} onChange={this.onChange} />
            <Menu onClick={this.onSelect}>{menu}</Menu>
          </div>
        }
      >
        {children}
      </Dropdown>
    );
  }
}

export default UserSelector;
