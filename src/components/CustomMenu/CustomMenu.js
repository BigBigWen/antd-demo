import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import './CustomMenu.less';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MAX_SUBMENU_ITEMS = 6;

const getMenuGroup = (arr, className) => {
  return (
    <MenuItemGroup className={className} key={className}>
      {arr.map(item => (
        <Menu.Item key={item.key}>
          <Link to={item.to}>{item.name}</Link>
        </Menu.Item>
      ))}
    </MenuItemGroup>
  );
};
const renderItem = arr => {
  if (arr.length <= MAX_SUBMENU_ITEMS) {
    return arr.map(a => (
      <Menu.Item key={a.key}>
        <Link to={a.to}>{a.name}</Link>
      </Menu.Item>
    ));
  }
  return [
    getMenuGroup(arr.slice(0, Math.ceil(arr.length / 2)), 'left-group-item'),
    getMenuGroup(arr.slice(Math.ceil(arr.length / 2)), 'right-group-item')
  ];
};

class CustomMenu extends React.Component {
  render() {
    const { menuList, location } = this.props;
    const selectedKeys = location.pathname
      .split('/')
      .filter(i => !!i && isNaN(parseFloat(i)));
    return (
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={selectedKeys}
        className="c-custom-menu"
      >
        {menuList.map((item, index) => {
          if (item.son.length) {
            return (
              <SubMenu
                key={item.name}
                title={item.name}
                className={
                  item.son.length <= MAX_SUBMENU_ITEMS
                    ? 'c-singleSubMen-container'
                    : 'c-subMenu-container'
                }
                children={renderItem(item.son)}
              />
            );
          }
          return (
            <MenuItem key={item.key}>
              <Link to={item.to}>{item.name}</Link>
            </MenuItem>
          );
        })}
      </Menu>
    );
  }
}

CustomMenu.propTypes = {
  // key: PropTypes.oneOfType([
  //   PropTypes.string.isRequired,
  //   PropTypes.number.isRequired
  // ]),
  // title: PropTypes.string,
  // menuItemArr: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  //     text: PropTypes.oneOfType([PropTypes.string]).isRequired
  //   })
  // )
};
CustomMenu.defaultProps = {
  key: '',
  title: ''
};
export default CustomMenu;
