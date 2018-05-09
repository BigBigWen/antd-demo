import './NotSupport.less';
import Icon_360 from 'media/img/360.png';
import Icon_Chrome from 'media/img/Chrome.png';
import Icon_Edge from 'media/img/Edge.png';
import Icon_Firefox from 'media/img/Firefox.png';
import Icon_Safari from 'media/img/Safari.png';

const source = [
  {
    src: Icon_Chrome,
    name: 'Google Chrome',
    isRecommend: true,
    fileUrl: 'http://kf-prod.oss-cn-beijing.aliyuncs.com/browser/Chrome.exe'
  },
  {
    src: Icon_360,
    name: '360极速浏览器',
    isRecommend: false,
    fileUrl: '#'
  },
  {
    src: Icon_Firefox,
    name: '火狐浏览器',
    isRecommend: false,
    fileUrl: '#'
  },
  {
    src: Icon_Edge,
    name: 'Microsoft Edge',
    isRecommend: false,
    fileUrl: '#'
  },
  {
    src: Icon_Safari,
    name: 'Safari',
    isRecommend: false,
    fileUrl: '#'
  }
];

const imgBlock = ({ src, name, isRecommend, fileUrl }) =>
  isRecommend
    ? `<a href=${fileUrl} class='block'>
  <img src=${src}>
  <span>${name}</span>
  <span>(推荐)</span>
</a>`
    : `<a href=${fileUrl} class='block-not-recommend'>
  <img src=${src}>
  <span>${name}</span>
</a>`;

const result = `<div class='page-not-support'>
  <div class="title">你看到这个页面是因为你正在使用不被支持的浏览器</div>
  <div class="sub-title">目前我们支持以下浏览器: </div>
  <div class="block-wrapper">
    ${source.reduce((prev, current) => {
      prev += imgBlock({ ...current });
      return prev;
    }, '')}
  </div>
</div>`;

export default result;
