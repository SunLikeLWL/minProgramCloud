//index.js
const app = getApp()

const DB = wx.cloud.database().collection("list")

Page({
  data: {
    user: {
      name: '',
      age: null
    },
    list: [],
    chooseId: null,
    chooseIndex: null
  },

  onLoad: function () {
    this.getDBData();
  },
  inputUserName: function (e) {
    console.log(e.detail.value)
    let user = this.data.user;
    user.name = e.detail.value;
    this.setData({
      user
    })
  },
  inputUserAge(e) {
    console.log(e.detail.value);
    let user = this.data.user;
    user.age = e.detail.value;
    this.setData({
      user
    })
  },
  addData: function () {
    console.log("add");
    let user = this.data.user;
    wx.showLoading({
      title: 'Loading',
    })
    let _this = this;
    DB.add({
      data: user,
      success: function (res) {
        console.log("添加成功", res)
        wx.showToast({
          title: '添加成功！',
          icon: 'none'
        })
        _this.setData({
          user: {
            name: null,
            age: null
          }
        })
        _this.getDBData();
        wx.hideLoading()
      },
      fail: function (err) {
        console.log("添加失败", err)
      }
    })

  },
  deleteData: function () {
    console.log("delete");
    let user = this.data.user;
    let _this = this;
    let _id = this.data.chooseId;
    if (_id) {

      DB.doc(_id).remove({
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: '删除成功！',
            icon: "none"
          })
          _this.setData({
            user: {
              name: null,
              age: null
            },
            chooseIndex: null,
            chooseId: null
          })
          _this.getDBData()
        },
        fail(err) {
          console.log(err);
          wx.showToast({
            title: '删除失败！',
            icon: "none"
          })
        }
      })
    } else {
      wx.showToast({
        title: '请选择删除选项！',
        icon: "none"
      })
    }
  },
  chooseList: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    console.log(index);
    for (let i = 0; i < list.length; i++) {
      list[i].choose = false;
    }
    list[index].choose = true;
    this.setData({
      chooseId: id,
      list: list,
      chooseIndex: index,
      user: list[index]
    })
  },

  editData: function () {
    console.log("edit")
    let user = this.data.user;
    let _this = this;
    let _id = this.data.chooseId;
    if (_id) {
      let index = this.data.chooseIndex;
      let list = this.data.list;
      let user = list[index]
      if (list[index]) {
        this.setData({
          user: user
        })
      }
      DB.doc(_id).update({
        data: {
          name: user.name,
          age: user.age
        },
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: '修改成功！',
            icon: "none"
          })
          _this.getDBData()
        },
        fail(err) {
          console.log(err);
          wx.showToast({
            title: '修改失败！',
            icon: "none"
          })
        }
      })
    } else {
      wx.showToast({
        title: '请选择修改选项！',
        icon: "none"
      })
    }
  },
  getData: function () {
    console.log("get")
    let _this = this;
    this.getDBData(function () {
      wx.showToast({
        title: '获取成功！',
        icon: "none"
      })
    });
  },

  getDBData: function (callback) {
    let _this = this;
    DB.get({
      success: function (res) {
        console.log(res);
        _this.setData({
          list: res.data
        })
        if (callback) {
          callback();
        }
      }
    })
  }

})