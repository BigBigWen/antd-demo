import { compose, largeNum, sum } from 'lib/helper';

const pieTotal = ({ name, unit, data, top = '40%' }) => ({
  text: `${name}\n`,
  left: 'center',
  top,
  textStyle: {
    color: '#666',
    fontSize: 14,
    align: 'center'
  },
  subtext: compose(
    i => i + ` ${unit}`,
    largeNum,
    sum,
    arr => arr.filter(i => i !== '--'),
    arr => arr.map(i => i.value)
  )(data),
  subtextStyle: {
    color: '#333',
    fontSize: 18
  }
});

export default pieTotal;
