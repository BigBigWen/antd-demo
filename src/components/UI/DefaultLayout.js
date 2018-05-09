import React from 'react';
import Breadcrumb from './Breadcrumb';
const Fragment = React.Fragment;

const DefaultLayout = ({ component: Component, ...rest }) => (
  <Fragment>
    <Breadcrumb />
    <div className="default-container">{<Component {...rest} />}</div>
  </Fragment>
);

export default DefaultLayout;
