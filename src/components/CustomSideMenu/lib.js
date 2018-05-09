const compose = (...fns) => val =>
  [...fns].reverse().reduce((prev, fn) => fn(prev), val);
const notEmptyArr = a => a && a.length;
const mapKey = arr => arr.map(i => (i || {}).key + '');

export const isSame = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const getType = (rootKey, data) =>
  compose(
    result => (result || {}).key,
    arr => arr.find(i => mapKey(i.children).includes(rootKey))
  )(data);

export const getDefaultOpenKeys = (target, data) => {
  let stack = [];
  let find = false;
  target = target + '';
  const parseTree = treeNodes => {
    for (var i = 0, len = treeNodes.length; i < len; i++) {
      if (find) return;
      if (i !== 0) {
        stack.pop(); // 删除上一个兄弟节点，i = 0时会删除父节点
      }
      stack.push(treeNodes[i].key);
      if (notEmptyArr(treeNodes[i].children)) {
        parseTree(treeNodes[i].children);
      } else {
        if (treeNodes[i].key === target) {
          find = true;
          stack.pop(); // 找到了，删除目标节点自身
          return;
        }
      }
    }
    !find && stack.pop(); // 说明走完一圈没找到，删除本层最后一个节点，回到上一层
  };

  parseTree(data);
  return stack;
};
