import React from 'react';
import { Input, Form, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import md5 from 'md5';
import { login } from 'actions';
import './Login.less';

const FormItem = Form.Item;

class Login extends React.Component {
  state = {
    globalError: null
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(
          {
            uid: values.userName,
            password: md5(values.password),
            application: 'kingfisher-static',
            remember: values.remember
          },
          this.handleFormError
        );
      }
    });
  };

  handleFormError = error => this.setState({ globalError: error.message });

  resetError = () => this.setState({ globalError: null });

  render() {
    const { getFieldDecorator } = this.props.form;
    const { remember, rememberName } = this.props;
    console.log('page----' + remember);
    console.log(typeof remember);
    const { globalError } = this.state;
    return (
      <div className="page-login">
        <div className="header-wrapper">
          点滴汇聚数据&nbsp;&nbsp;&nbsp;&nbsp;智慧驱动管理
        </div>
        <div className="column-top" />
        <div className="column-mid" />
        <div className="column-bottom" />
        <div className="circuit-top" />
        <div className="circuit-mid" />
        <div className="circuit-bottom" />
        <div className="data-top" />
        <div className="data-mid" />
        <div className="data-bottom" />
        <div className="table-top" />
        <div className="table-mid" />
        <div className="table-bottom" />
        <div className="empty-top" />
        <div className="empty-mid" />
        <div className="empty-bottom" />
        <div className="box-box" />
        <div className="box-table" />
        <div className="box-body" />
        <div className="box-shadow" />
        <div className="form-wrapper">
          <div className="title">欢迎登录</div>
          <div className="form-container">
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('userName', {
                  initialValue: remember ? rememberName || '' : '',
                  rules: [{ required: true, message: '请输入用户名' }]
                })(
                  <Input
                    placeholder="用户名"
                    onPressEnter={this.handleSubmit}
                    onFocus={this.resetError}
                  />
                )}
              </FormItem>
              <FormItem className="password">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }]
                })(
                  <Input
                    type="password"
                    placeholder="密码"
                    onPressEnter={this.handleSubmit}
                    onFocus={this.resetError}
                  />
                )}
              </FormItem>
              <FormItem className="checkbox">
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: remember
                })(<Checkbox>记住用户名</Checkbox>)}
                <a className="forget-password-link" href="">
                  忘记密码
                </a>
              </FormItem>
              {globalError ? <div className="error">{globalError}</div> : null}
              <Button type="primary" htmlType="submit" className="submit-btn">
                登录
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ user }) => ({
  remember: user.remember,
  rememberName: user.rememberName
});
const mapDispatchToProps = dispatch => {
  return {
    login: (data, callback) => dispatch(login(data, callback))
  };
};

export default Form.create()(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
