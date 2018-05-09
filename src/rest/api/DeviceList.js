import { fetch } from '../../lib/util';

const base = '/api/projekt';

export const getDeviceList = async query => {
  // const json = await fetch(`${base}/device-list`, {
  //   method: 'GET',
  //   query
  // });
  return {
    data: [
      {
        type: '采集终端',
        name: '终端一号',
        status: '在线',
        project: 'mock项目',
        site: 'mock配电房'
      },
      {
        type: '表计',
        name: '表计一号',
        status: '离线',
        project: 'mock项目',
        site: 'mock配电房'
      }
    ],
    total: 1,
    numberOfElements: 2
  };
};
