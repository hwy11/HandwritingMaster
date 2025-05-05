// pages/index/index.js

const app = getApp();
const MAX_TEXT_LENGTH = 5000; // 最大文本长度限制

Page({
  data: {
    textContent: '', // 输入的文本内容
    textCount: 0, // 当前字数
    maxTextLength: MAX_TEXT_LENGTH, // 最大字数限制
    selectedStyle: 'regular', // 默认手写风格
    selectedPaper: 'ruled', // 默认纸张背景
    isGenerating: false, // 是否正在生成
    showStyleOptions: false, // 是否显示风格选项
    showPaperOptions: false, // 是否显示纸张选项
    
    // 可选的手写风格
    styleOptions: [
      { id: 'regular', name: '普通字体', description: '常见的中规中矩手写风格' },
      { id: 'cursive', name: '行书字体', description: '流畅连贯的书写风格' },
      { id: 'neat', name: '工整字体', description: '整齐规范的书写风格' },
      { id: 'sloppy', name: '潦草字体', description: '随意不拘束的书写风格' }
    ],
    
    // 可选的纸张背景
    paperOptions: [
      { id: 'ruled', name: '横线稿纸', description: '标准横线格式纸张' },
      { id: 'grid', name: '方格纸', description: '方格网格式纸张' },
      { id: 'plain', name: '空白纸', description: '无格式空白纸张' },
      { id: 'letter', name: '信纸', description: '正式信件格式纸张' }
    ],

    selectedStyleName: '',
    selectedPaperName: ''
  },

  onLoad: function() {
    // 从全局获取设置
    const settings = app.globalData.settings;
    if (settings) {
      this.setData({
        selectedStyle: settings.handwriting.style,
        selectedPaper: settings.paper.type
      });
    }
    
    // 从缓存恢复上次编辑的内容
    const savedContent = wx.getStorageSync('lastEditContent');
    if (savedContent) {
      this.setData({
        textContent: savedContent,
        textCount: savedContent.length
      });
    }

    this.updateSelectedStyleName();
    this.updateSelectedPaperName();
  },
  
  onShow: function() {
    // 如果从设置页面返回，更新显示
    const settings = app.globalData.settings;
    if (settings) {
      this.setData({
        selectedStyle: settings.handwriting.style,
        selectedPaper: settings.paper.type
      });
    }

    this.updateSelectedStyleName();
    this.updateSelectedPaperName();
  },
  
  // 监听文本输入
  onTextInput: function(e) {
    const text = e.detail.value;
    const count = text.length;
    
    this.setData({
      textContent: text,
      textCount: count
    });
    
    // 保存到本地缓存，避免意外丢失
    wx.setStorageSync('lastEditContent', text);
    
    // 保存到全局变量
    app.globalData.currentText = text;
  },
  
  // 清空文本内容
  clearText: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            textContent: '',
            textCount: 0
          });
          wx.setStorageSync('lastEditContent', '');
          app.globalData.currentText = '';
        }
      }
    });
  },
  
  // 显示/隐藏风格选项
  toggleStyleOptions: function() {
    this.setData({
      showStyleOptions: !this.data.showStyleOptions,
      showPaperOptions: false // 同时关闭另一个选项
    });
  },
  
  // 显示/隐藏纸张选项
  togglePaperOptions: function() {
    this.setData({
      showPaperOptions: !this.data.showPaperOptions,
      showStyleOptions: false // 同时关闭另一个选项
    });
  },
  
  // 选择手写风格
  selectStyle: function(e) {
    const styleId = e.currentTarget.dataset.id;
    this.setData({
      selectedStyle: styleId,
      showStyleOptions: false
    });
    
    // 更新全局设置
    const settings = app.globalData.settings;
    settings.handwriting.style = styleId;
    app.updateSettings(settings);

    this.updateSelectedStyleName();
  },
  
  // 选择纸张背景
  selectPaper: function(e) {
    const paperId = e.currentTarget.dataset.id;
    this.setData({
      selectedPaper: paperId,
      showPaperOptions: false
    });
    
    // 更新全局设置
    const settings = app.globalData.settings;
    settings.paper.type = paperId;
    app.updateSettings(settings);

    this.updateSelectedPaperName();
  },
  
  // 生成手写效果
  generateHandwriting: function() {
    if (!this.data.textContent.trim()) {
      wx.showToast({
        title: '请输入文本内容',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.textCount > this.data.maxTextLength) {
      wx.showToast({
        title: `文本超过${this.data.maxTextLength}字限制`,
        icon: 'none'
      });
      return;
    }
    
    this.setData({ isGenerating: true });
    
    // 保存当前设置到全局
    app.globalData.currentText = this.data.textContent;
    
    // 调用云函数生成手写内容
    wx.cloud.callFunction({
      name: 'generateHandwriting',
      data: {
        text: this.data.textContent,
        settings: app.globalData.settings
      },
      success: res => {
        console.log('云函数调用成功：', res);
        
        if (res.result && res.result.fileID) {
          // 保存结果到全局
          app.globalData.resultImage = res.result.fileID;
          app.globalData.resultPdf = res.result.pdfID || '';
          
          // 跳转到结果页
          wx.navigateTo({
            url: '/pages/result/result'
          });
        } else {
          wx.showToast({
            title: '生成失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('云函数调用失败：', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ isGenerating: false });
      }
    });
  },
  
  // 前往设置页面
  goToSettings: function() {
    wx.switchTab({
      url: '/pages/settings/settings'
    });
  },
  
  // 用户粘贴事件处理
  handlePaste: function(e) {
    // 处理粘贴内容，可以在这里对粘贴的内容做预处理
    console.log('Paste event triggered:', e);
  },
  
  // 生命周期函数：页面卸载时
  onUnload: function() {
    // 保存当前编辑的内容
    wx.setStorageSync('lastEditContent', this.data.textContent);
  },

  updateSelectedStyleName: function() {
    const style = this.data.styleOptions.find(item => item.id === this.data.selectedStyle);
    this.setData({
      selectedStyleName: style ? style.name : '未知风格'
    });
  },

  updateSelectedPaperName: function() {
    const paper = this.data.paperOptions.find(item => item.id === this.data.selectedPaper);
    this.setData({
      selectedPaperName: paper ? paper.name : '未知背景'
    });
  }
});
