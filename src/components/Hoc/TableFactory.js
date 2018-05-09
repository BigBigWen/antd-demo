import React from 'react';

const TableFactory = ({ getAction, query, ...rest } = {}) => Component => {
  return class ComponentWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.query = { page: 0, size: 10, ...query, ...this.props.queryProps };
      this.state = {
        query: { ...this.query },
        data: [],
        loading: false,
        numberOfElements: 0
      };
    }

    componentDidMount() {
      this.onFilterChange();
    }

    onFilterChange = async (queryParams = {}) => {
      // this.setState({ loading: true }); //TODO 调试用
      const combineQuery = {
        ...this.query,
        ...queryParams,
        page: queryParams.size
          ? 0
          : queryParams.page || queryParams.page === 0
            ? queryParams.page
            : this.query.page
      };
      this.query = { ...combineQuery };
      const values = await getAction(this.query);
      this.setState({
        data: values.data,
        total: values.total,
        numberOfElements: values.numberOfElements,
        loading: false,
        query: { ...this.query }
      });
      //删除页面最后一项拿上一页的内容放在各个组件删除操作中处理
    };

    render() {
      const { data, total, query, loading, numberOfElements } = this.state;
      const definedProps = {
        data,
        total,
        query,
        loading,
        numberOfElements,
        onFilterChange: this.onFilterChange,
        ...rest
      };
      return <Component {...definedProps} {...this.props} />;
    }
  };
};

export default TableFactory;
