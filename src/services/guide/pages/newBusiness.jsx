import React, { Component, PropTypes } from 'react';
import { Row, Col, Icon } from 'antd';
import { newBusinessColumns } from './config';
import style from './style.less';


class NewBusiness extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={style.container} ref="container">
        {
          newBusinessColumns.map((item, index) => {
            return (
              <div className={style.stepOne} key={index}>
                <h1>{ item.vast_step }</h1>
                <div className={style.stepInfo}>
                  {
                    item.tiny_step.map((step, key) => {
                      return (
                        <div key={key}>
                          {
                            step.type ? <h2>{ step.type }</h2> : ''
                          }
                          {
                            step.img_url ? <Row gutter={16} className={style.showBox}>
                              <Col sm={24} className={style.imgBox}>
                                <img className={style.imgMain} src={step.img_url} alt="新手指南" />
                              </Col>
                            </Row> : ''
                          }
                          {
                            step.micro_step ? step.micro_step.map((it, i) => {
                              return (
                                <div key={i}>
                                  <div className={style.guideOne}>
                                    <p className={style.title}>{ it.title }</p>
                                  </div>
                                  <Row gutter={16} className={style.showBox}>
                                    <Col sm={24} className={style.imgBox}>
                                      <img className={style.imgMain} src={it.img_url} alt="新手指南" />
                                    </Col>
                                  </Row>
                                </div>
                              )
                            }) : ''
                          }
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

module.exports = NewBusiness;
