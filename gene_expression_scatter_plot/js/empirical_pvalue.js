// JavaScript Document
/*
	计算 Empirical P-Value,无返回值,计算得到的Empirical P-Value均存储到传过来的数组中,groups与totals.
	变量gene1,gene2表示json格式的G1,G2数据数组;
	变量datas是main.js里的,存储每个tissue下的坐标;
	变量groups是main.js里的,存储每个datas的tissue，相关系数，个数，pvalue信息;
	变量totals是main.js里的,记录所有点数的pvalue，Empirical P-Value.
*/
function empirical_p(gene1,gene2,datas,groups,totals){
	// count数组用来统计随机排列后每组数据的相关系数大于原排列后的个数
	var count = new Array(groups.length+1).fill(0);
	// total随机排列后所有点数的pvalue与Empirical P-Value,对应totals
	var total = new Array();
	// console.log(totals);
	// 重复10000次
	var round = 10000;
	console.log("计算 10000 次");
	for(var m = 0;m<round ;m++){
		// 随机排列后的data与group,对应datas与groups
		var data = new Array();
		var group = new Array();
		// 得到新的gene1/gene2随机排列后的数组
		var newGene1 = randomJson(gene1);
		var newGene2 = randomJson(gene2);
		// console.log(newGene1);
		// num用来遍历点,不断累加,直到最后一个点
		var num = 0;
		// 计算随机排序后的data
		for(var i=0;i<datas.length;i++){
			// 用数组记录随机排序后每个tissue里所有点的坐标
			data[i] = new Array();
			// 遍历坐标值,生成随机排序后每个点的新坐标
			for(var j=0;j<datas[i].length;j = j+2){
				data[i].push(newGene1[num]);
				data[i].push(newGene2[num]);
				num++;
			}
		}
		// 使用main.js里的getCorrelationCoefficientAndSetGroups函数,填充group与total数组,获得相关系数
		getCorrelationCoefficientAndSetGroups (data,group,total);
		// 遍历计算随机排列后每组数据的相关系数大于原排列后的个数
		for(var k=0;k<count.length-1;k++){
			// 比较的相关系数是绝对值
			if(group[k][1]>groups[k][1]){
				count[k]++;
			}
			//比较的是非绝对值的相关系数 k<count.length
//			if(total[k]>totals[k]){
//				count[k]++;
//			}
		}
		// m是随机循环的参数;在每次循环都比较一下随机排序和原顺序的所有点的相关系数
		if(total[m]>totals[0]){
			count[groups.length]++;
		}
	}
	// 计算每个tissue的Empirical P-Value,并放在传参的groups里
	for(var i=0;i<groups.length;i++){
		count[i]=count[i]/round;
		groups[i].push(count[i]);
	}
	// 计算所有点的Empirical P-Value,并放在传参的totals里
	totals.push(count[groups.length]/round);
}
// 随机排列数组内的数据
function randomJson(arr){
	for (let i = 1; i < arr.length; i++) {
		// 产生有效随机数
        const random = Math.floor(Math.random() * (i + 1));
		// 随机交换数组元素数据
        [arr[i], arr[random]] = [arr[random], arr[i]];
    }
	return arr;
}