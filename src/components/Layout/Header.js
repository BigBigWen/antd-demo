import React from 'react';
import { Icon, Avatar } from 'antd';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { navFormatter } from '../../constants/navigation';
import { logOut, changeTheme } from '../../actions';
import Logo from 'media/img/logo.png';
import CustomMenu from 'components/CustomMenu/CustomMenu';
import './Header.less';

class Header extends React.Component {
  render() {
    const { authList, logOut, logoUrl, username, location } = this.props;
    return (
      <div className="c-header">
        <img src={logoUrl} className="logo" alt="极熵" />
        <div className="title">
          <span>电能管理系统 </span>
          <span className="version">{process.env.VERSION}</span>
        </div>
        <CustomMenu menuList={navFormatter(authList)} location={location} />
        <div className="username-wrapper">
          <div className="username">
            <span> 欢迎！{username}</span>
            <Avatar className="avatarIcon" icon="user" />
            <ul>
              <Link to="/personal-center">
                <li className="changePasswordIcon">
                  <Icon className="icon" type="calendar" />任务中心
                </li>
              </Link>
              <Link to="/change-cipher">
                <li className="changePasswordIcon">
                  <Icon className="icon" type="edit" />修改密码
                </li>
              </Link>
              <li className="" onClick={this.props.changeTheme}>
                <Icon className="icon" type="sync" />
                切换主题
              </li>
              <li className="loginOutIcon" onClick={logOut}>
                <Icon className="icon" type="logout" />退出登录
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user, global }) => ({
  authList: user.authList,
  logoUrl: user.logoUrl,
  username: user.username
});
const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut()),
    changeTheme: () => dispatch(changeTheme())
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
