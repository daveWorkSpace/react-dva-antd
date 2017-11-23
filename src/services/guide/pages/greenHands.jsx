import React, { Component, PropTypes } from 'react';
import { Row, Col, Icon } from 'antd';
import { greenHandsColumns } from './config';
import style from './style.less';

class GreenHands extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const container = this.refs.container;
  }

  render() {
    return (
      <div className={style.container} ref="container">
        {
                    greenHandsColumns.map((item, index) => {
                      return (
                        <div className={style.stepOne} key={index}>
                          <h1>{ item.vast_step }</h1>
                          <div className={style.stepInfo}>
                            {
                              item.tiny_step.map((tip, key) => {
                                return (
                                  <div key={key}>
                                    <div className={style.guideOne}>
                                      <p className={style.title}> <span className={style.punctuation}>{ tip.step } &nbsp;&nbsp;</span>{ tip.title }</p>
                                    </div>
                                    <Row gutter={16} className={style.showBox}>
                                      <Col sm={24} className={style.imgBox}>
                                        <img className={style.imgMain} src={tip.img_url} alt="新手指南" />
                                      </Col>
                                    </Row>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      )
                    })
                }
      </div>
    )
  }
}

export default GreenHands;
