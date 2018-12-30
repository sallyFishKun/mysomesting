/**
 * Created by Administrator on 2018/12/17 0017.
 */
let map = ''
let markers = [];
let zoom = 0;
let isTwo = false;
let selfIcon = '/static/home/myPosition.png'

let myZoomCtrl = ''
let lushu = '';
let lushuPoints = []//路书轨迹点集合；
let lushuOys={}//路书覆盖物；
export default {
  init(div, zoo = 17){
	zoom = zoo;

	map = new BMap.Map(div); // 创建Map实例
	var point = new BMap.Point(116.404, 39.915); // 创建点坐标
	map.centerAndZoom(point, zoom);
	map.enableScrollWheelZoom();//开启鼠标滚轮缩放
	map.centerAndZoom(point, zoom);// 初始化地图,设置中心点坐标和地图级别
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	map.addControl(top_left_navigation);
	map.addControl(new BMap.MapTypeControl());

  },
  setTwo(is){
	isTwo = is;
  },
  getTwo(){
	return isTwo;
  },
  getMap(){
	return map;
  },
  /**
   * 在地图上添加覆盖物
   * @param point：point
   * @param w
   * @param h
   * @param url
   */
  diyMapIcon(point, w, h, url, ba = ''){
	let icon0 = this.setIcon({w, h, url})
	let marker2 = new BMap.Marker(point, icon0);  // 创建标注
	marker2.ba = ba
	map.addOverlay(marker2);  // 将标注添加到地图中;
	return marker2
  },
  //设置标注的样式 0//用户 ,1车辆
  /**
   *
   * @param obj  {w,h,url}
   * @returns {{icon: *}}
   */
  setIcon({w,h,url}){
	let myIcon
	let size = new BMap.Size(w * .5, h * .5);
	myIcon = new BMap.Icon(url, new BMap.Size(w, h),
		{
		  anchor: size,
		  imageSize: new BMap.Size(w, h),
		});

	return {icon: myIcon}
  },
  /**设置用户icon经纬度*/
  setUserIcon(point){
	let w = 25, h = 25, url = selfIcon;
	this.diyMapIcon(point, w, h, url,'userIcon')

	//let obj = {
	//  w, h, url
	//}
	//let icon0 = this.setIcon(obj)
	//var marker2 = new BMap.Marker(point, icon0);  // 创建标注
	//map.addOverlay(marker2);  // 将标注添加到地图中
  },

  doOneMk(lng, lat, iconObj){
	let icon = this.setIcon(iconObj);
	let point = new BMap.Point(lng, lat)
	let marker2 = new BMap.Marker(point, icon);
	map.addOverlay(marker2);
	map.panTo(point)
  },
  //
  /**
   *type:0浏览器地址，1车辆地址，2浏览器地址和车辆地址（两点）；
   * 当type!=0时，
   * lng,lat,direction ：经纬度，方向
   * ,msgObj：标题信息
   * iconObj ：mk 图标样式；
   */
  doMarkers(type = 0, obj, callback = function () {
  }){
	if (type != 0) {
	  var {lng,lat,direction ,msgObj,iconObj}=obj;
	}
	this.clearOverlays();
	this.geolocation().then((res) => {
	  markers[0] = res;
	  this.setLabelUser(markers[0]);
	  this.setUserIcon(markers[0])
	  if (type == 0) {
		map.centerAndZoom(markers[0], zoom);
	  } else {
		markers[1] = msgObj.point = new BMap.Point(lng, lat);
		this.setLabel(msgObj)
		let icon = this.setIcon(iconObj);
		let marker2 = new BMap.Marker(markers[1], icon);
		map.addOverlay(marker2);
		//map.panTo(markers[1])
		this.twoLocation(false)
		marker2.setRotation(direction)
	  }
	  if (type == 2) {
		this.twoLocation(true)
	  }
	  callback();

	})
  },
  setLabelUser(point){
	let msgObj = {
	  point,
	  style: {
		color: '#00A0EA',
		width: '80px',
		border: '1px solid #00A0EA'
	  },
	  msg: '我的位置',
	  offw: -40,
	  offh: -40
	}
	this.setLabel(msgObj)
  },
  /**
   * 设置文本居中；
   * offh,偏移量高度
   * msg,标题
   * bgcolor,背景颜色
   * point:经纬度；
   * @param obj
   */
  setLabel(obj){
	let {point,offh,offw,msg,style}=obj
	if (!offw) {
	  offw = -80
	}
	var opts = {
	  position: point,    // 指定文本标注所在的地理位置
	  offset: new BMap.Size(offw, offh)    //设置文本偏移量
	}
	var label = new BMap.Label(msg, opts);  // 创建文本标注对象
	let mystyle = {
	  background: '#fff',
	  color: '#000',
	  fontSize: "12px",
	  height: "20px",
	  width: '160px',
	  textAlign: 'center',
	  lineHeight: "20px",
	  border: 'none',
	  borderRadius: '5px'
	}
	mystyle = {...mystyle, ...style}
	label.setStyle(mystyle);
	map.addOverlay(label);

  },
  twoLocation(is)//false一个marker居中地图， true：两个在地图中居中；
  {
	if (!is) {
	  map.setZoom(zoom)
	  map.centerAndZoom(markers[1], zoom);// 初始化地图,设置中心点坐标和地图级别

	} else {
	  map.setViewport(markers, {margins: [65, 50, 50, 50]});
	}

  },
  //放大放小；
  newControl(callback)
  {
//	  / 定义一个控件类,即function
	function ZoomControl() {
	  // 默认停靠位置和偏移量
	  this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
	  this.defaultOffset = new BMap.Size(10, 40);
	}

	// 通过JavaScript的prototype属性继承于BMap.Control
	ZoomControl.prototype = new BMap.Control();
	// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
	// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
	let self = this
	ZoomControl.prototype.initialize = function (map) {
	  // 创建一个DOM元素
	  var div = document.createElement("div");
	  div.innerHTML = '<img src="static/home/position.png" alt="111"  style="height:45px">'
	  // 设置样式
	  div.style.cursor = "pointer";
	  // 绑定事件,点击一次放大两级
	  div.onclick = function (e) {
		isTwo = !isTwo;
		callback();
	  }
	  // 添加DOM元素到地图中
	  map.getContainer().appendChild(div);
	  // 将DOM元素返回
	  return div;
	}
	// 创建控件
	myZoomCtrl = new ZoomControl();
	// 添加到地图当中

  },
  showCtrl(){
	map.addControl(myZoomCtrl);
  },
  hideCtrl(){
	map.removeControl(myZoomCtrl);
  },

  clearOverlays()
  {
	map.clearOverlays();
  }
  ,
  // 用经纬度设置地图中心点
  geolocation()
  {
	let self = this;
	//this.toastLoading()
	//浏览器地址；
	var geolocation = new BMap.Geolocation();
	let pp = new Promise(function (resolve, reject) {
	  resolve(new BMap.Point(114.02597366, 22.54605355));
	  //geolocation.getCurrentPosition(function (r) {
	  //if (this.getStatus() == BMAP_STATUS_SUCCESS) {
	  //  console.log("r.pointr.point",r.point)
	  //resolve(r.point);
	  //}
	  //else {
	  //  reject();
	  //  alert('failed' + this.getStatus());
	  //}
	  //})
	})
	return pp;
  }
  ,
  //经纬度解析地址；
  getAddress(lng, lat){
	var myGeo = new BMap.Geocoder();
	let pp = new Promise(function (resolve, reject) {
// 根据坐标得到地址描述
	  myGeo.getLocation(new BMap.Point(lng, lat), function (result) {
		if (result) {
		  resolve(result.address);
		} else {
		  reject()
		}
	  });
	});
	return pp
  },
  clearOverlays(){
	map.clearOverlays();
  },
  /**
   * 设置路书 ；
   * @param pointArr ：经纬度集合
   * @param DirectionArr ：方向集合
   */
  doLushu(pointArr, DirectionArr){
	let points = []
	for (let i = 0; i < pointArr.length; i++) {
	  let pp = new BMap.Point(pointArr[i].lng, pointArr[i].lat);
	  points.push(pp)
	}
	lushuPoints = points;//全局；
	lushu=this.initLushu(lushuPoints, DirectionArr)//初始化路书；

	this.addLushuOverlay(lushuPoints); //画轨迹线（蓝线）（绿线）、'起'和'终' icon
	let startPt = points[0]
	let endPt = points[points.length - 1]
	map.setViewport([startPt, endPt], {margins: [30, 30, 30, 30]}); //startPt, endPt两点在屏幕居中显示。
	map.setZoom(14);//为了防止startPt, endPt两点相近或相同，但是轨迹线范围很大。地图放置到14，比较合理。这里根据业务是否需要设置；
	lushu.start();//开始动画
  },
  initLushu(points, DirectionArr){
	let myIcon = this.setIcon({w: 19, h: 32, url: "static/car/icon_car_move.png"});
	let lushuObj = {
	  landmarkPois: [],
	  //landmarkPois:此参数是路书移动的时候碰到这个点会触发pauseTime停留中设置的时间，单位为秒，经纬度误差超过十米不会停止
	  //landmarkPois:[
	  //  {lng:markers[0].lng,lat:markers[0].lat,html:'<img src="xian.jpg" /></br>西安北站到了',pauseTime:1},
	  //  {lng:markers[1].lng,lat:markers[1].lat,html:'咸阳站到了',pauseTime:1},
	  //  {lng:markers[2].lng,lat:markers[2].lat,html:'咸阳秦都站到了',pauseTime:1},
	  //  {lng:markers[3].lng,lat:markers[3].lat,html:'兴平站到了',pauseTime:1}
	  //],
	  //defaultContent: '动车继续前行，况且况且...',
	  icon: myIcon.icon,
	  speed: 2000,//速度，单位米每秒
	  autoView: true,
	  enableRotation: true,
	  DirectionArr: DirectionArr
	};
	return new BMapLib.LuShu(map, points, lushuObj);//初始化路书；
  },
  //画轨迹线（蓝线）（绿线）、'起'和'终' icon
  addLushuOverlay(points){

	let startPt = points[0]
	let endPt = points[points.length - 1]
	let oneStart=this.diyMapIcon(startPt, 25, 30, "/static/car/icon_start.png", 'oneStart')
	let oneEnd=this.diyMapIcon(endPt, 25, 30, "/static/car/icon_end.png", 'oneEnd');

	let blueLine = new BMap.Polyline(points, {strokeColor: "#2962FF", strokeWeight: 6, strokeOpacity: 0.8});
	blueLine.ba = "blueLine";
	map.addOverlay(blueLine);//添加轨迹到地图
	let greenLine = new BMap.Polyline([], {strokeColor: "#00F53D", strokeWeight: 6, strokeOpacity: .8});
	greenLine.ba = 'greenLine';
	map.addOverlay(greenLine);
	lushuOys={blueLine,greenLine,oneStart,oneEnd}//自定义的路书覆盖物集合对象；
  },
  /**
   * 根据索引设置绿线path；
   * @param index 轨迹点索引；
   * 本来打算不删除。但是如果不删除绿线直接设置setPath，当点击‘快退’的时候，绿线并未刷新。所以要删除后添加；
   * 在百度地图中removeOverlay，简直难用到要吐血。清空某个折线，折线类型会全部会跟着删除（蓝线也被删除了。太无语了），所以只能把后再添加蓝线...
   * 这个方法能完美的和进度条结合。无论怎么拖动进度条，绿线都能在相应的轨迹点上；
   */
  playGreenLine(index){
	let oy=lushuOys.greenLine;
	let oy0=lushuOys.blueLine;
	let arr2 = [];
	for (let i in lushuPoints) {
	  if (i < index) {
		arr2.push(lushuPoints[i])
	  }
	}

	oy.setPath(arr2);
	map.removeOverlay(oy0);
	map.addOverlay(oy0);
	map.removeOverlay(oy);
	map.addOverlay(oy);

  },

  //设置速度
  setLushuSpeed(speed){
	lushu._opts.speed = speed
  },
  //设置索引
  setLushuIndex(index){
	if (index < 1) {
	  index = 0;
	}
	if (index >= lushu._path.length - 1) {
	  index = lushu._path.length - 1
	}
	if (lushu.i >= lushu._path.length - 1 || lushu._fromPause) {
	  lushu.start();
	}
	lushu.i = index;
  },
  //小车走过的轨迹；画绿线
  drawGreenLine(index){
	let points = []
	for (let i = 0; i < index; i++) {
	  points.push(lushuPoints[i])
	}
	map.addOverlay(new BMap.Polyline(points, {
	  strokeColor: "green",
	  strokeWeight: 5,
	  strokeOpacity: 0.5,
	})); // 画线
  },
  //如果已经到达终点；清空已经走过的绿线轨迹；
  clearLushuGreenLine(){
	//不知道为什么removeOverlay没有效果，所以清空全部覆盖物，重新添加；
	if (lushu.i >= lushu._path.length - 1) {
	  map.clearOverlays();
	  this.addLushuOverlay(lushuPoints);
	}
  },
  //0开始，1停止，2快进，3快退，4停止，5删除清空路书
  setlushuType(type){
	console.log('lushu', lushu.i, map.getOverlays());
	let index = 0;
	switch (type) {
	  case 0:
		lushu.start();
		break;
	  case 1:
		lushu.pause();
		break;
	  case 2:
		if (lushu.i < lushu._path.length - 6) {
		  index = lushu.i + 5;
		}
		this.setLushuIndex(index)
		break;
	  case 3:
		//快退
		if (lushu.i < lushu._path.length - 6) {
		  index = lushu.i - 5;
		}
		this.setLushuIndex(index)
		break;
	  case 4:
		lushu.stop();
		break;
	  case 5:
		//  删除清空路书
		lushu.stop();
		lushu = ''
		break;
	}
  }
}
