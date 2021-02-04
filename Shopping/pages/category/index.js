// pages/category/index.js
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 1 获取本地存储中的数据
    const Cates=wx.getStorageSync("cates");
    // 2 判断
    if(!Cates){
      // 不存在 发送请求获取数据
      this.getCates();
    }
    else{
      // 有旧的数据 定义过期时间
      if(Date.now() - Cates.time > 1000*300){
        // 重新发送请求
        this.getCates();
      }else{
          // 可以使用旧数据
          this.Cates = Cates.data;
          let leftMenuList=this.Cates.map(v=>v.cat_name);
          let rightContent=this.Cates[0].children;
          this.setData({
            leftMenuList,
            rightContent
        })
      }
    }
    
  },

  // 获取分类数据
  async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res=>{
    //   this.Cates=res.data.message;

    //   // 把接口数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1、使用es7的async await来发送请求
    const res = await request({url:"/categories"});
    this.Cates=res;
    // 把接口数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    // 构造左侧的大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })

  },
  // 左侧点击事件
  handleItemTap(e){
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签顶部的距离
      scrollTop:0
    })
  }
})