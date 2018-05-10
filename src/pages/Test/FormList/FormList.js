import React from 'react';
import { Input, Icon, Form } from 'antd';
const FormItem = Form.Item;
import FormListFactory from '../../../components/Hoc/FormListFactory';
import './FormList.less';

class FormCom extends React.Component {
  render() {
    const { form, keys, handleCancel, isEdit } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    return keys.map((k, index) => {
      return (
        <div className="c-item-container" key={k}>
          <div className="title-container">
            <span className="title">计费进线信息</span>
            {keys.length > 1 ? (
              <span
                className="operation"
                disabled={keys.length === 1}
                onClick={() => handleCancel(k)}
              >
                取消
              </span>
            ) : null}
          </div>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '名称' : ''}
            required={false}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入名称'
                }
              ]
            })(
              <Input
                placeholder="请输入名称"
                style={{ width: '60%', marginRight: 8 }}
              />
            )}
          </FormItem>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '电压等级' : ''}
            required={false}
          >
            {getFieldDecorator(`电压[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入电压等级'
                }
              ]
            })(
              <Input
                placeholder="请输入电压等级"
                style={{ width: '60%', marginRight: 8 }}
              />
            )}
          </FormItem>
        </div>
      );
    });
  }
}
const FormList = FormListFactory({
  handleCancel: () => {},
  handelDelete: () => {},
  handelAdd: () => {},
  handelSubmit: () => {},
  handelEdit: () => {},
  getFormList: () => {}
})(FormCom);

export default FormList;
