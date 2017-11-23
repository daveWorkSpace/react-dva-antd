module.exports = function getDatas(obj) {
	    let arr=[];
    let _obj = {};
		for(let name in obj){
			_obj[name] = obj[name] ;
		}
		arr.push(_obj);
	return arr;
	// return JSON.stringify(arr);
}
