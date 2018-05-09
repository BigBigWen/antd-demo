import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { breadcrumbNameMap } from '../../constants/route';
import './Breadcrumb.less';

const Item = Breadcrumb.Item;
const Fragment = React.Fragment;

const pathnameToBreadcrumb = pathname => {
  const paths = pathname.split('/').filter(i => !!i);
  return [...paths].reduce((prev, current, currentIndex, array) => {
    if (Number.isInteger(parseFloat(current))) {
      prev[prev.length - 1].path += `/${current}`;
    } else {
      prev.push({
        path: `/${array.slice(0, currentIndex + 1).join('/')}`,
        name: breadcrumbNameMap[current]
      });
    }
    return [...prev];
  }, []);
};

class CustomBreadcrumb extends React.Component {
  render() {
    const breadcrumbs = pathnameToBreadcrumb(this.props.location.pathname);
    const { match: { isExact, ...rest } } = this.props;
    return (
      <Fragment>
        {isExact ? (
          <Breadcrumb>
            {breadcrumbs.map((item, index) => (
              <Item key={item.name}>
                <Link to={item.path}>{item.name}</Link>
              </Item>
            ))}
          </Breadcrumb>
        ) : null}
      </Fragment>
    );
  }
}

export default withRouter(CustomBreadcrumb);
