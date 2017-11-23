import React from 'react';
import style from '../style.less'

class NoArea extends React.Component {

  render() {
    return (
      <div className={style.center} >
        <img src="images/righticon.png" />
        <h4>暂无数据</h4>
      </div>
    );
  }
}

module.exports = NoArea;
