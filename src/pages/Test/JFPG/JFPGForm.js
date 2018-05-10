import React from 'react';
import Price from './lib';
import {
  Form,
  Radio,
  Input,
  InputNumber,
  Checkbox,
  Tooltip,
  Row,
  Col,
  DatePicker,
  Button
} from 'antd';
import moment from 'moment';
import JFPGBar from './JFPG';
const FormItem = Form.Item;
import './JFPGCom.less';

const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const priceForm = [
  { label: '尖峰电价', inputName: 'jian', resultType: 'jian' },
  { label: '高峰电价', inputName: 'feng', resultType: 'feng' },
  { label: '平段电价', inputName: 'ping', resultType: 'ping' },
  { label: '低谷电价', inputName: 'gu', resultType: 'gu' }
];
const exceptSummerPriceForm = [
  { label: '尖峰电价', inputName: 'jian-exceptSum', resultType: 'jian' },
  { label: '高峰电价', inputName: 'feng-exceptSum', resultType: 'feng' },
  { label: '平段电价', inputName: 'ping-exceptSum', resultType: 'ping' },
  { label: '低谷电价', inputName: 'gu-exceptSum', resultType: 'gu' }
];

class JFPGComponent extends React.Component {
  componentDidMount() {
    this.setState({
      result: this.Price.init({}),
      exceptSummerResult: this.exceptSummerPrice.init({})
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      season: false,
      summertime: [moment().month(6), moment().month(10)],
      priceError: false,
      exceptSummerPriceError: false,
      result: {
        jian: new Set(),
        feng: new Set(),
        ping: new Set(),
        gu: new Set()
      },
      exceptSummerResult: {
        jian: new Set(),
        feng: new Set(),
        ping: new Set(),
        gu: new Set()
      }
    };
    this.Price = new Price(30);
    this.exceptSummerPrice = new Price(30);
  }
  onSeasonChange = season => {
    this.setState({ season });
  };
  changeResult = result => {
    this.setState({
      result,
      priceError: false,
      exceptSummerPriceError: false
    });
  };
  changeExpectSumResult = result => {
    this.setState({ exceptSummerResult: result });
  };
  onChangeSummerTime = value => {
    this.setState({ summertime: value });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(!this.Price.isFull(this.state.result));
        if (!this.Price.isFull(this.state.result)) {
          this.setState({ priceError: true });
        } else {
          if (this.state.season) {
            if (!this.exceptSummerPrice.isFull(this.state.exceptSummerResult)) {
              this.setState({
                exceptSummerPriceError: true
              });
            } else {
              //发请求
            }
          } else {
            //发请求
          }
        }
      }
    });
  };
  render() {
    const {
      summertime,
      currentType,
      season,
      result,
      exceptSummerResult,
      priceError,
      exceptSummerPriceError
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItem = (data, Price, resultObj) =>
      data.map(item => (
        <Row className="row-container" key={item.inputName}>
          <Col span={12}>
            <FormItem {...formItemLayout} label={item.label}>
              {getFieldDecorator(item.inputName, {
                rules: [{ required: true, message: `请输入${item.inputName}!` }]
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}元`}
                  min={0}
                  step={0.00001}
                />
              )}
            </FormItem>
          </Col>
          <Col span={2} offset={2}>
            时段{' '}
          </Col>
          <Col span={8}>
            {Price.getTimeFrame(resultObj[item.resultType]).map(a => (
              <div key={a}>{a}</div>
            ))}
          </Col>
        </Row>
      ));
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="c-jfpg-wrapper">
          <div className="master-control">
            <JFPGBar
              showSeason
              onSeasonChange={this.onSeasonChange}
              season={season}
              handelChangeResult={this.changeResult}
              Price={this.Price}
            />
            <div className="time-bar-error">{priceError && '请选满24小时'}</div>
            <div className="form-wrapper">
              {season && (
                <Row className="row-container season ">
                  <Col span={3} offset={2}>
                    夏季:
                  </Col>
                  <Col span={10}>
                    <RangePicker
                      allowClear={false}
                      placeholder={['开始月份', '截止月份']}
                      format="YYYY-MM"
                      value={summertime}
                      mode={['month', 'month']}
                      onPanelChange={this.onChangeSummerTime}
                    />
                  </Col>
                </Row>
              )}
              {formItem(priceForm, this.Price, result)}
              {/* <formItem
            data={priceForm}
            Price={this.Price}
            resultObj={result}
            /> */}
              {/* <Row className='row-container'>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="尖峰电价"
                >
                  {getFieldDecorator('jian', {
                    rules: [{required: true, message: '请输入尖峰电价!'}],
                  })(
                    <InputNumber 
                    style={{width:'100%'}}
                    formatter={value => `${value}元`}
                    min={0} step={0.00001}/>
                  )}
                </FormItem>
              </Col>
              <Col span={2} offset={2}>时段 </Col>
              <Col span={8}>
              {
                this.Price.getTimeFrame(result['jian']).map(a=><div key={a}>
                {a}
                </div>)
              }
              </Col>
            </Row>
            <Row className='row-container'>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="高峰电价"
                >
                  {getFieldDecorator('feng', {
                    rules: [{required: true, message: '请输入高峰电价!'}],
                  })(
                    <InputNumber 
                    style={{width:'100%'}}
                    formatter={value => `${value}元`}
                     min={0} step={0.00001}/>
                  )}
                </FormItem>
              </Col>
              <Col span={2} offset={2}>时段 </Col>
              <Col span={8}>
              {
                this.Price.getTimeFrame(result['feng']).map(a=><div key={a}>
                {a}
                </div>)
              }
              </Col>
            </Row>
            <Row className='row-container'>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="平段电价"
                >
                  {getFieldDecorator('ping', {
                    rules: [{required: true, message: '请输入平段电价!'}],
                  })(
                    <InputNumber 
                    style={{width:'100%'}}
                    formatter={value => `${value}元`}
                     min={0} step={0.00001}/>
                  )}
                </FormItem>
              </Col>
              <Col span={2} offset={2}>时段 </Col>
              <Col span={8}>
              {
                this.Price.getTimeFrame(result['ping']).map(a=><div key={a}>
                {a}
                </div>)
              }
              </Col>
            </Row>
            <Row className='row-container'>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="低谷电价"
                >
                  {getFieldDecorator('gu', {
                    rules: [{required: true, message: '请输入低谷电价!'}],
                  })(
                    <InputNumber 
                    style={{width:'100%'}}
                    formatter={value => `${value}元`}
                     min={0} step={0.00001}/>
                  )}
                </FormItem>
              </Col>
              <Col span={2} offset={2}>时段 </Col>
              <Col span={8}>
              {
                this.Price.getTimeFrame(result['gu']).map(a=><div key={a}>
                {a}
                </div>)
              }
              </Col>
            </Row> */}
            </div>
          </div>
          {season && (
            <div className="subordination">
              <JFPGBar
                Price={this.exceptSummerPrice}
                handelChangeResult={this.changeExpectSumResult}
              />
              <div className="time-bar-error">
                {exceptSummerPriceError && '请选满24小时'}
              </div>
              <div className="form-wrapper">
                <Row className="row-container season">
                  <Col span={4} offset={2}>
                    非夏季:
                  </Col>
                  <Col span={15}>
                    {`${
                      summertime[0].month() <= 1
                        ? ''
                        : '1月~' + summertime[0].month() + '月'
                    }`}
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    {`${summertime[1].month()}月~12月`}
                  </Col>
                </Row>
                <Row className="row-container">
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="尖峰电价">
                      {getFieldDecorator('jian-exceptSum', {
                        rules: [{ required: true, message: '请输入尖峰电价!' }]
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={value => `${value}元`}
                          min={0}
                          step={0.00001}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={2}>
                    时段{' '}
                  </Col>
                  <Col span={8}>
                    {this.Price.getTimeFrame(exceptSummerResult['jian']).map(
                      a => <div key={a}>{a}</div>
                    )}
                  </Col>
                </Row>
                <Row className="row-container">
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="高峰电价">
                      {getFieldDecorator('feng-exceptSum', {
                        rules: [{ required: true, message: '请输入高峰电价!' }]
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={value => `${value}元`}
                          min={0}
                          step={0.00001}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={2}>
                    时段{' '}
                  </Col>
                  <Col span={8}>
                    {this.Price.getTimeFrame(exceptSummerResult['feng']).map(
                      a => <div key={a}>{a}</div>
                    )}
                  </Col>
                </Row>
                <Row className="row-container">
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="平段电价">
                      {getFieldDecorator('ping-exceptSum', {
                        rules: [{ required: true, message: '请输入平段电价!' }]
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={value => `${value}元`}
                          min={0}
                          step={0.00001}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={2}>
                    时段{' '}
                  </Col>
                  <Col span={8}>
                    {this.Price.getTimeFrame(exceptSummerResult['ping']).map(
                      a => <div key={a}>{a}</div>
                    )}
                  </Col>
                </Row>
                <Row className="row-container">
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="低谷电价">
                      {getFieldDecorator('gu-exceptSum', {
                        rules: [{ required: true, message: '请输入低谷电价!' }]
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          formatter={value => `${value}元`}
                          min={0}
                          step={0.00001}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={2} offset={2}>
                    时段{' '}
                  </Col>
                  <Col span={8}>
                    {this.Price.getTimeFrame(exceptSummerResult['gu']).map(
                      a => <div key={a}>{a}</div>
                    )}
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
        <div className="c-jfpg-wrapper-footer-container">
          <Button type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
          <Button onClick={this.props.handleCancel}>取消</Button>
        </div>
      </Form>
    );
  }
}
export default Form.create()(JFPGComponent);
