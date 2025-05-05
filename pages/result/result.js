// pages/result/result.js
const app = getApp();

Page({
  data: {
    resultImage: '', // 生成的图片地址
    resultPdf: '', // 生成的PDF地址
    isFullscreen: false, // 是否全屏预览
    isLoading: true, // 是否正在加载
    isExporting: false, // 是否正在导出
    savingImage: false, // 是否正在保存图片
    savingPdf: false, // 是否正在保存PDF
    errorMessage: '', // 错误信息
    settings: null, // 当前设置
    exportOptions: [
      { id: 'image', name: '图片(.jpg)' },
      { id: 'pdf', name: 'PDF文档(.pdf)' }
    ],
    selectedExport: 'image', // 默认导出格式
    isShowExportOptions: false, // 是否显示导出选项
  },

  onLoad: function() {
    this.setData({
      settings: app.globalData.settings,
      isLoading: true,
      errorMessage: ''
    });
    
    // 获取生成结果
    if (app.globalData.resultImage) {
      this.loadResultImage(app.globalData.resultImage);
    } else {
      this.setData({
        isLoading: false,
        errorMessage: '未找到生成结果，请返回重试'
      });
    }
  },

  // 加载生成的图片
  loadResultImage: function(fileID) {
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        console.log('获取图片临时链接成功', res);
        if (res.fileList && res.fileList.length > 0) {
          this.setData({
            resultImage: res.fileList[0].tempFileURL,
            isLoading: false
          });
        } else {
          this.setData({
            isLoading: false,
            errorMessage: '获取图片链接失败'
          });
        }
      },
      fail: err => {
        console.error('获取图片临时链接失败', err);
        this.setData({
          isLoading: false,
          errorMessage: '获取图片链接失败'
        });
      }
    });
    
    // 如果有PDF也获取链接
    if (app.globalData.resultPdf) {
      wx.cloud.getTempFileURL({
        fileList: [app.globalData.resultPdf],
        success: res => {
          if (res.fileList && res.fileList.length > 0) {
            this.setData({
              resultPdf: res.fileList[0].tempFileURL
            });
          }
        }
      });
    }
  },

  // 切换全屏预览
  toggleFullscreen: function() {
    this.setData({
      isFullscreen: !this.data.isFullscreen
    });
  },

  // 显示导出选项
  showExportOptions: function() {
    this.setData({
      isShowExportOptions: true
    });
  },

  // 选择导出格式
  selectExportFormat: function(e) {
    const format = e.currentTarget.dataset.id;
    this.setData({
      selectedExport: format,
      isShowExportOptions: false
    });
  },

  // 保存到相册
  saveToAlbum: function() {
    if (this.data.savingImage) return;
    
    this.setData({ savingImage: true });
    
    // 获取用户授权
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 没有授权，获取授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => this.downloadAndSaveImage(),
            fail: () => {
              this.setData({ savingImage: false });
              wx.showModal({
                title: '提示',
                content: '需要您授权保存图片到相册',
                confirmText: '去授权',
                success: modalRes => {
                  if (modalRes.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          });
        } else {
          // 已授权，直接保存
          this.downloadAndSaveImage();
        }
      }
    });
  },

  // 下载并保存图片
  downloadAndSaveImage: function() {
    wx.showLoading({ title: '正在保存...' });
    
    wx.downloadFile({
      url: this.data.resultImage,
      success: res => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: err => {
              console.error('保存图片失败', err);
              wx.hideLoading();
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            },
            complete: () => {
              this.setData({ savingImage: false });
            }
          });
        } else {
          wx.hideLoading();
          this.setData({ savingImage: false });
          wx.showToast({
            title: '下载图片失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('下载图片失败', err);
        wx.hideLoading();
        this.setData({ savingImage: false });
        wx.showToast({
          title: '下载图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 保存PDF
  savePdf: function() {
    if (!this.data.resultPdf || this.data.savingPdf) return;
    
    this.setData({ savingPdf: true });
    wx.showLoading({ title: '正在保存PDF...' });
    
    wx.downloadFile({
      url: this.data.resultPdf,
      success: res => {
        if (res.statusCode === 200) {
          // 打开PDF
          wx.openDocument({
            filePath: res.tempFilePath,
            fileType: 'pdf',
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: 'PDF已打开',
                icon: 'success'
              });
            },
            fail: err => {
              console.error('打开PDF失败', err);
              wx.hideLoading();
              wx.showToast({
                title: '打开PDF失败',
                icon: 'none'
              });
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '下载PDF失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('下载PDF失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '下载PDF失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ savingPdf: false });
      }
    });
  },

  // 导出文件
  exportFile: function() {
    if (this.data.isExporting) return;
    
    // 根据选择的格式决定操作
    if (this.data.selectedExport === 'image') {
      this.saveToAlbum();
    } else if (this.data.selectedExport === 'pdf') {
      if (this.data.resultPdf) {
        this.savePdf();
      } else {
        // 如果没有现成的PDF，需要先生成
        this.generatePdf();
      }
    }
  },

  // 生成PDF
  generatePdf: function() {
    this.setData({ isExporting: true });
    wx.showLoading({ title: '正在生成PDF...' });
    
    // 调用云函数生成PDF
    wx.cloud.callFunction({
      name: 'generatePdf',
      data: {
        imageFileId: app.globalData.resultImage,
        settings: app.globalData.settings
      },
      success: res => {
        console.log('PDF生成成功：', res);
        if (res.result && res.result.fileID) {
          app.globalData.resultPdf = res.result.fileID;
          
          wx.cloud.getTempFileURL({
            fileList: [res.result.fileID],
            success: urlRes => {
              if (urlRes.fileList && urlRes.fileList.length > 0) {
                this.setData({
                  resultPdf: urlRes.fileList[0].tempFileURL
                });
                // PDF已生成，调用保存
                this.savePdf();
              }
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: 'PDF生成失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('PDF生成失败：', err);
        wx.hideLoading();
        wx.showToast({
          title: 'PDF生成失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ isExporting: false });
      }
    });
  },

  // 重新生成
  regenerate: function() {
    wx.navigateBack();
  },

  // 返回主页
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 预览图片
  previewImage: function() {
    if (this.data.resultImage) {
      wx.previewImage({
        urls: [this.data.resultImage],
        current: this.data.resultImage
      });
    }
  }
});
