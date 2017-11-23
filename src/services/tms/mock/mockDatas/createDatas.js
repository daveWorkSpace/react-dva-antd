module.exports = function getDatas(obj) {
	let n = 24,arr=[];
	const continueArr = [
		'state',
		'division_code',
		'province_code',
		'verify_state',
		'sex',
		'delivery_state',
		'delivery_mode'
	];
	while(n > 0){
		let _obj = {};
		let _tmpl = null;
		for(let name in obj){
			_tmpl = obj[name] + '_' + n;
			if (Array.indexOf(name) !== -1) {
				_tmpl = obj[name];
			};
			_obj[name] = _tmpl;
		}
		arr.push(_obj);
		n--;
	}
	return arr;
	// return JSON.stringify(arr);
}
