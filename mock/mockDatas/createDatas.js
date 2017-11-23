module.exports = function getDatas(obj) {
  let n = 50,arr=[];
  while(n > 0){
    let _obj = {};
    for(let name in obj){
      _obj[name] = obj[name] + '_' + n ;
    }
    arr.push(_obj);
    n--;
  }
  return arr;
  // return JSON.stringify(arr);
}
