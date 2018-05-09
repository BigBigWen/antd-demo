import { getTwoDigits } from 'lib/helper';
const transfromToHour = time => {
  let hour = Math.floor(time / 60);
  let minute = time % 60;
  return `${getTwoDigits(hour)}:${getTwoDigits(minute)}`;
};
const intersect = (a, b) => new Set([...a].filter(x => b.has(x)));
const union = (a, b) => new Set([...a, ...b]);
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));
const isChild = (a, b) => [...b].every(x => a.has(x));
class Price {
  constructor(length) {
    this.length = length;
    this.data = Array.from({ length: 1440 / length + 1 }, (_, i) => i * length);
    this.result = {};
  }
  init = ({ ...result }) => {
    this.result = {
      jian: result.jian || new Set(),
      feng: result.jian || new Set(),
      ping: result.jian || new Set(),
      gu: result.jian || new Set()
    };
    return this.result;
  };
  getLabel = time => {
    return `${transfromToHour(time - this.length)}~${transfromToHour(time)}`;
  };
  getData = () => {
    return [...this.data];
  };
  getTimeAxis = () => {
    return this.data
      .slice(1)
      .map((a, ind) => ({ id: ind, label: this.getLabel(a), value: a }));
  };
  getTimeArr = (start, end) => {
    return Array.from(
      { length: (end - start) / this.length + 1 },
      (_, i) => start + i * this.length
    );
  };
  calcLength = result => {
    let resultLength = 0;
    Object.keys(result).forEach(key => {
      resultLength += Array.from(result[key]).length;
    });
    return resultLength;
  };
  compareSize = (num1, num2) => {
    let [min, max] = [num1, num2].sort((a, b) => a - b);
    return [min, max];
  };
  getTimeFrame = time => {
    let source = [...time].sort((a, b) => a - b);
    let startArr = [];
    let endArr = [];
    source.reduce((prev, curr, ind) => {
      if (curr !== prev + this.length) {
        startArr.push(curr === 30 ? 0 : curr);
        ind !== 0 && endArr.push(prev);
      }
      return curr;
    }, []);
    endArr.push(source[source.length - 1]);
    let result = startArr.map(
      (start, ind) =>
        `${transfromToHour(start)}~${transfromToHour(endArr[ind])}`
    );
    console.log(result);
    return result || [];
  };
  getResult = (newData, currType, result) => {
    let newResult = { ...result };
    Object.keys(newResult).forEach(item => {
      if (item !== currType) {
        if (isChild(result[item], newData)) {
          newResult[item] = difference(result[item], newData);
        } else {
          newResult[item] = difference(
            result[item],
            intersect(result[item], newData)
          );
        }
      } else {
        newResult[item] = newData;
      }
    });
    return newResult;
  };
  onEndItemClick = (value, boundary, result, currentType) => {
    let [start, end] = this.compareSize(value, boundary.start);
    let newSet = new Set(this.getTimeArr(start, end));
    let oldSet = result[currentType];
    let newData = union(oldSet, newSet);
    let newResult = this.getResult(newData, currentType, result);
    return newResult;
  };
  isFull = result => {
    const { jian, feng, ping, gu } = result;
    let length =
      [...jian].length +
      [...feng].length +
      [...ping].length +
      [...gu].length +
      1;
    return length === this.data.length;
  };
}
export default Price;
