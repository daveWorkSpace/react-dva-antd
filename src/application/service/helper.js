//根据起始结束生成数组
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
}

module.exports = {
  range,
}
