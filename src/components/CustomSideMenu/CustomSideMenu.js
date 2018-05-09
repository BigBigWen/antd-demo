import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Radio, message, Tooltip } from 'antd';
import { isSame, getDefaultOpenKeys, getType } from './lib';
import './CustomSideMenu.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const renderMenu = ({
  menuItem,
  enableSubMenu,
  selectedKeys,
  onClick,
  onSubTitleClick
}) => {
  const { key, title, children } = menuItem;
  return children ? (
    <SubMenu
      key={key}
      className={selectedKeys.includes(key) ? 'ant-menu-item-selected' : ''}
      title={<Tooltip title={title}>{title}</Tooltip>}
      onTitleClick={enableSubMenu ? onClick : onSubTitleClick}
    >
      {children.map(i =>
        renderMenu({
          menuItem: i,
          enableSubMenu,
          selectedKeys,
          onClick,
          onSubTitleClick
        })
      )}
    </SubMenu>
  ) : (
    <Menu.Item key={key}>
      <Tooltip title={title}>{title}</Tooltip>
    </Menu.Item>
  );
};

export default class CustomSideMenu extends React.Component {
  static defaultProps = {
    data: [],
    enableSubMenu: false,
    enableMulti: false,
    isMulti: false,
    selectedKeys: [],
    openKeys: [],
    onClick: () => {},
    onMultiModeChange: () => {}
  };

  static propTypes = {
    data: PropTypes.array,
    enableSubMenu: PropTypes.bool,
    enableMulti: PropTypes.bool,
    isMulti: PropTypes.bool,
    onClick: PropTypes.func,
    onMultiModeChange: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [...this.props.selectedKeys],
      isMulti: this.props.isMulti
    };
  }

  shouldSupportType = !this.props.enableSubMenu;

  componentWillReceiveProps(nextProps) {
    const { selectedKeys, data } = nextProps;
    if (selectedKeys && !isSame(selectedKeys, this.state.selectedKeys)) {
      this.setState({
        selectedKeys: selectedKeys,
        openKeys: getDefaultOpenKeys(selectedKeys[0], data)
      });
    }
  }

  overReach = maxKeys => {
    message.warning(`支持最多同时选择${maxKeys}个对象`);
    return true;
  };

  onClick = ({ item, key, keyPath }) => {
    let overreach = false;
    const rootParentKey = this.shouldSupportType
      ? keyPath[keyPath.length - 1]
      : null;
    const { selectedKeys, isMulti, openKeys } = this.state;
    const { enableMulti, maxKeys, data } = this.props;
    const set = new Set([...selectedKeys]);
    // 支持多选且选中多选按钮
    if (enableMulti && isMulti) {
      set.has(key)
        ? set.delete(key)
        : set.size < maxKeys
          ? set.add(key)
          : (overreach = this.overReach(maxKeys));
    } else {
      set.clear();
      set.add(key);
    }
    this.setState(
      {
        selectedKeys: [...set],
        openKeys: Array.from(
          new Set([...openKeys, ...getDefaultOpenKeys([...set][0], data)])
        )
      },
      () => {
        if (!overreach) {
          this.props.onClick({
            selectedKeys: [...this.state.selectedKeys],
            type: this.shouldSupportType
              ? getType(rootParentKey, this.props.data)
              : null
          });
        }
      }
    );
  };

  onSubTitleClick = ({ key }) => {
    let openKeys = new Set([...this.state.openKeys]);
    openKeys.has(key) ? openKeys.delete(key) : openKeys.add(key);
    this.setState({ openKeys: [...openKeys] });
  };

  onMultiModeChange = e => {
    this.setState({ isMulti: e.target.value }, () =>
      this.props.onMultiModeChange(this.state.isMulti ? 'multiple' : 'single')
    );
  };

  render() {
    const { data, enableSubMenu, enableMulti } = this.props;
    const { selectedKeys, isMulti, showTooltip, openKeys } = this.state;
    return data && data.length && data[0].key ? (
      <Menu
        className="c-side-menu"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onClick={this.onClick}
        mode="inline"
      >
        {enableMulti && (
          <Radio.Group
            className="radio-group"
            value={isMulti}
            size="small"
            onChange={this.onMultiModeChange}
          >
            <Radio.Button value={false}>单选</Radio.Button>
            <Radio.Button value={true}>多选</Radio.Button>
          </Radio.Group>
        )}
        {data.map(group => (
          <MenuItemGroup key={group.key} title={group.title}>
            {group.children.map(i =>
              renderMenu({
                menuItem: i,
                enableSubMenu,
                selectedKeys,
                showTooltip,
                onClick: this.onClick,
                onSubTitleClick: this.onSubTitleClick
              })
            )}
          </MenuItemGroup>
        ))}
      </Menu>
    ) : null;
  }
}
