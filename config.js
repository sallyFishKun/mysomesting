/**
 * Created by Administrator on 2018/11/7 0007.
 */
import { Toast } from 'vant';

let rootUrl = 'https://miapp.vkel.cn'
let key = '68YHQt0qMKGg8orSro2YannF'
let setItem = (key, val)=> {
  window.localStorage.setItem(key, val)
}
let getItem = (key)=> {
  let item = window.localStorage.getItem(key)
  return item
}

let myFormat =function (date, fmt = 'yyyy-MM-dd hh:mm') { //author: meizz
  var o = {
	"M+" : date.getMonth()+1,                 //月份
	"d+" : date.getDate(),                    //日
	"h+" : date.getHours(),                   //小时
	"m+" : date.getMinutes(),                 //分
	"s+" : date.getSeconds(),                 //秒
	"q+" : Math.floor((date.getMonth()+3)/3), //季度
	"S"  : date.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
	fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
	if(new RegExp("("+ k +")").test(fmt))
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}


function gobaiduMap(lng, lat, title = "1111"){
  //let location = '40.047669,116.313082';
  let obj = {
	location: Number(lat) + ',' + Number(lng),
	title
  }

  //let url=`http://api.map.baidu.com/marker?location=39.916979519873,116.41004950566&title=目的位置&content=百度奎科大厦&output=html`
  let url=`http://api.map.baidu.com/marker?location=${obj.location}&title=目的位置&content=${title}&output=html&src=beifang`
  //let url = `http://api.map.baidu.com/marker?content=sdsfsdf&output=html&` + $.param(obj)
  console.log(url, "location")
  window.location.href = url
}
//import Vue from 'vue'

let config = {}
config.install = function (Vue, options) {
  Vue.use(Toast);
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {

	// 逻辑...
  }
  // 2. 添加全局资源
  Vue.directive('my-directive', {
	bind (el, binding, vnode, oldVnode) {
	  // 逻辑...
	}

  })
  // 3. 注入组件
  Vue.mixin({
	created: function () {
	  // 逻辑...
	},
	methods: {
	  goHome(){
		this.$router.push('/')

	  },
	  goBack(){
		//this.$router.push({path:'/',query:{tabidx:this.tabidx}})
		console.log(window.history,"wwwwwwww")
		window.history.length > 1
			? this.$router.go(-1)
			: this.$router.push('/')
	  },
	  myAjax(url, data, param = {}){
		//console.log(param.type,?mobile=1440191070379&&password=E10ADC3949BA59ABBE56E057F20F883E)
		//data.key = key;
		data.key = '4GMzZX7Gv9RCLawj2h6mUgDs';
		//if (url.indexOf('Login') == -1) {
		//  data.Token = getItem('token') || null
		//data.mobile=1440191070379
		//data.password ="E10ADC3949BA59ABBE56E057F20F883E"// getItem('password') || null
data.mobile= getItem('mobile')|| null
data.password= getItem('password')|| null
		//data.password ="E10ADC3949BA59ABBE56E057F20F883E"// getItem('password') || null

		//data.UserId=962003
		//data.account = "CESHI-T100-8"//getItem('account') || null
		  //data.password ="9AD5E571DCCF50BD206255913E204E49"// getItem('password') || null
		//}
		//https://miapp.vkel.cn/api/ter/GetPagingByMobile?mobile=1440191070379&password=E10ADC3949BA59ABBE56E057F20F883E&key=4GMzZX7Gv9RCLawj2h6mUgDs
		return new Promise((resovle, reject) => {
		  const toast1 = Toast.loading({
			duration: 0,
			mask: true,
			message: '加载中...',
			mask: false,
			forbidClick: true,
		  });

		  $.ajax({
			"type": param.type || "get",
			"async": param.async || true,
			"url": rootUrl + url,

			"data": data || "",
			"success": res => {
			  toast1.clear();
			  //console.log(res, "success")
			  //if (res.ReturnCode == 'SUCCESS') {
				resovle(res);
				//return;
			  //}
			  //else if (res.ReturnCode == 'FAIL') {
				//Toast(res.ReturnMsg);
				//if (res.TokenInvalid == 0) {//token 失效
				//  this.$router.push('/login')
				//}
				//reject(res);
			  //}
			},
			"error": err => {
			  toast1.clear();
			  Toast('系统错误');
			  console.log(err, "err")
			  console.log(err.statusCode(),"11111111")
			  reject(err);
			}
		  })
		})
	  }
	}
  })

  // 4. 添加实例方法
  Vue.prototype.config = {
	gobaiduMap,
	myFormat,
	setItem,
	getItem,
	color: "#00A0EA",
	sh:window.innerHeight-50,
	mytime:''
  }
  Vue.prototype.mytime=''//计时器
  Vue.prototype.toastLoading = ()=> {
	Toast.loading({
	  duration: 0,
	  mask: false,
	  message: '加载中...',
	  forbidClick: true,
	});
  },

  Vue.prototype.toastClear =()=> {
	Toast.clear();
  }
  Vue.prototype.toast = (msg, dn = 1000, fc = true)=> {
	//this.$toast({message:res.ReturnMsg,duration:1000,forbidClick:true});
	Toast({message: msg, duration: dn, forbidClick: fc})
  }

}
export default config