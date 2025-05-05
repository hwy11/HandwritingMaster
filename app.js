// app.js
App({
  onLaunch: function () {
    // 初始化云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      });
    } else {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    }

    // 获取系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.systemInfo = e;
        this.globalData.statusBarHeight = e.statusBarHeight;
        
        // 胶囊按钮位置信息
        let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        this.globalData.menuButtonInfo = menuButtonInfo;
        
        // 导航栏高度 = 状态栏高度 + 胶囊高度 + 上下间距(一般是2*8=16)
        this.globalData.navBarHeight = this.globalData.statusBarHeight + menuButtonInfo.height + 16;
      }
    });

    // 初始化全局设置
    this.initGlobalSettings();
  },

  initGlobalSettings: function() {
    // 从本地存储读取用户设置，如果没有则使用默认设置
    const settings = wx.getStorageSync('handwritingSettings') || this.getDefaultSettings();
    this.globalData.settings = settings;
  },

  getDefaultSettings: function() {
    return {
      // 手写样式设置
      handwriting: {
        style: 'regular', // 字体风格：regular, cursive, neat, sloppy
        size: 'medium',   // 字体大小：small, medium, large
        color: 'black',   // 字体颜色：black, blue
        angle: 0,         // 倾斜角度(度)
        spacing: 'normal' // 间距：tight, normal, loose
      },
      // 纸张背景设置
      paper: {
        type: 'ruled',    // 纸张类型：ruled, grid, plain, letter
        color: 'white',   // 纸张颜色：white, yellow
        texture: 'normal' // 纹理：smooth, normal, rough
      },
      // 错误模拟设置
      errors: {
        enabled: true,     // 是否启用错误模拟
        frequency: 'low',  // 错误频率：low, medium, high
        types: {
          crossout: true,  // 划线
          correction: true, // 涂改
          annotation: true  // 批注
        }
      },
      // 导出设置
      export: {
        format: 'image',   // 格式：image, pdf
        size: 'a4',        // 尺寸：a4, letter
        quality: 'high',   // 质量：medium, high
        orientation: 'portrait' // 方向：portrait, landscape
      }
    };
  },

  // 更新全局设置并保存到本地存储
  updateSettings: function(newSettings) {
    this.globalData.settings = {...this.globalData.settings, ...newSettings};
    wx.setStorageSync('handwritingSettings', this.globalData.settings);
  },

  globalData: {
    systemInfo: null,
    statusBarHeight: 0,
    menuButtonInfo: null,
    navBarHeight: 0,
    settings: null,
    // 当前输入的文本内容
    currentText: '',
    // 生成的结果图片
    resultImage: '',
    // 生成的结果PDF链接
    resultPdf: '',
    // 用户信息
    userInfo: null,
    // 判断用户是否授权
    hasUserInfo: false
  }
});
