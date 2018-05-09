const base = {
  type: 'pie'
  // barMaxWidth,
  // barGap,
  // barCategoryGap
};

const getPie = ({ name, data, ...rest }) => ({
  ...base,
  name,
  data,
  label: {
    normal: {
      show: false,
      position: 'center'
    },
    emphasis: {
      show: false
    }
  },
  labelLine: {
    normal: {
      show: false
    }
  },
  ...rest
});

export default getPie;
