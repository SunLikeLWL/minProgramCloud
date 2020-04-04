//index.js
const app = getApp()

const db = wx.cloud.database();



Page({
  data: {
    imgUrls: [],
    allImgUrls: []
  },

  onLoad: function () {

    db.collection('demo_01').where({
      name: '李旺理'
    }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log(res)
      }
    })
  },
  uploadFile: function () {
    let _this = this;
    wx.chooseImage({
      success: (chooseResult) => {


        _this.setData({
          imgUrls: []
        })

        const tempFilePaths = chooseResult.tempFilePaths;
        wx.showLoading({
          title: '上传中...',
        })
        let index = 0;

        _this.setData({
          imgUrls: tempFilePaths
        });
        tempFilePaths.map(function (path) {
          wx.cloud.uploadFile({
            cloudPath: 'avator/avator' + new Date().getTime(),
            filePath: path,
            success: res => {
              if (res.statusCode === 200) {

                console.log(res)

                if (res.fileID) {
                  db.collection('myheart').add({
                    // data 字段表示需新增的 JSON 数据
                    data: {
                      url: res.fileID,
                    },
                    success: function (res) {
                      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                      console.log(res)

                      wx.hideLoading();

                      wx.showToast({
                        title: '上传成功！',
                      })

                    }
                  })
                }




              } else {
                wx.showToast({
                  title: '上传失败！',
                })
              }

            }
          })
        })


      }
    })

  },
  getFile: function () {
    let _this = this;
    wx.showLoading({
      title: 'Loading',
    })
    db.collection('myheart').get({
      success: function (res) {
        console.log(res.data)
        let urls = [];
        res.data.map(function (item) {
          urls.push(item.url)
        })
        console.log(urls)
        _this.setData({
          imgUrls: urls
        })
        wx.hideLoading();
      }
    })
  }
})