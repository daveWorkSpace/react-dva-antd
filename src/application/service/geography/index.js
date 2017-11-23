class Geography {

  constructor() {
    this.province = require('./assets/province.json');
    this.city = require('./assets/city.json');
  }

  province() {
    return this.province
  }

  city() {
    return this.city;
  }

  //根据城市code获取城市名称
  cityName(code) {
    let cityName = '';
    const cityCode = `${code}`;
    const citesDict = this.city;
    try {
      cityName = citesDict.data[citesDict.index.indexOf(cityCode)].name;
    } catch (e) {
      cityName = '';
      const _len = citesDict.data;
      for (let i = 0; i < _len; i += 1) {
        if (citesDict.data[i]._id === cityCode) {
          cityName = citesDict.data[i].name;
        }
      }
    } finally {
      if (cityName.length === 0) {
        console.info('无匹配城市名称');
      }
    }
    return cityName;
  }
}

module.exports = Geography;
