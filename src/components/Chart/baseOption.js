const grid = {
  top: 50,
  right: 50,
  left: 70,
  bottom: 40
};

const getOption = option => ({
  grid,
  ...option
});

export default getOption;
