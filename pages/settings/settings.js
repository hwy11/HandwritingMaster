// pages/settings/settings.js
const app = getApp();

Page({
  data: {
    settings: {}, // 全局设置
    
    // 手写样式选项
    handwritingStyles: [
      { id: 'regular', name: '普通字体' },
      { id: 'cursive', name: '行书字体' },
      { id: 'neat', name: '工整字体' },
      { id: 'sloppy', name: '潦草字体' }
    ],
    
    // 字体大小选项
    fontSizes: [
      { id: 'small', name: '小号' },
      { id: 'medium', name: '中号' },
      { id: 'large', name: '大号' }
    ],
    
    // 字体颜色选项
    fontColors: [
      { id: 'black', name: '黑色', color: '#000000' },
      { id: 'blue', name: '蓝色', color: '#0055aa' }
    ],
    
    // 纸张类型选项
    paperTypes: [
      { id: 'ruled', name: '横线稿纸' },
      { id: 'grid', name: '方格纸' },
      { id: 'plain', name: '空白纸' },
      { id: 'letter', name: '信纸' }
    ],
    
    // 纸张颜色选项
    paperColors: [
      { id: 'white', name: '白色', color: '#ffffff' },
      { id: 'yellow', name: '淡黄色', color: '#fffbeb' }
    ],
    
    // 纸张纹理选项
    paperTextures: [
      { id: 'smooth', name: '平滑' },
      { id: 'normal', name: '普通' },
      { id: 'rough', name: '粗糙' }
    ],
    
    // 错误频率选项
    errorFrequencies: [
      { id: 'none', name: '无' },
      { id: 'low', name: '低' },
      { id: 'medium', name: '中' },
      { id: 'high', name: '高' }
    ],
    
    // 导出格式选项
    exportFormats: [
      { id: 'image', name: '图片' },
      { id: 'pdf', name: 'PDF' }
    ],
    
    // 导出尺寸选项
    exportSizes: [
      { id: 'a4', name: 'A4' },
      { id: 'letter', name: '信纸' }
    ],
    
    // 导出质量选项
    exportQualities: [
      { id: 'medium', name: '中等质量' },
      { id: 'high', name: '高质量' }
    ],
    
    // 导出方向选项
    exportOrientations: [
      { id: 'portrait', name: '纵向' },
      { id: 'landscape', name: '横向' }
    ],
    
    // 手风琴面板状态
    accordion: {
      handwriting: false,
      paper: false,
      errors: false,
      export: false
    }
  },

  onLoad: function() {
    // 加载全局设置
    this.setData({
      settings: app.globalData.settings || app.getDefaultSettings()
    });
  },
  
  // 切换手风琴面板
  togglePanel: function(e) {
    const panel = e.currentTarget.dataset.panel;
    const accordion = { ...this.data.accordion };
    
    // 关闭其他面板，只打开当前面板
    for (let key in accordion) {
      accordion[key] = key === panel ? !accordion[key] : false;
    }
    
    this.setData({ accordion });
  },
  
  // 更新手写样式
  updateHandwritingStyle: function(e) {
    const style = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.handwriting.style = style;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新字体大小
  updateFontSize: function(e) {
    const size = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.handwriting.size = size;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新字体颜色
  updateFontColor: function(e) {
    const color = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.handwriting.color = color;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新倾斜角度
  updateAngle: function(e) {
    const angle = parseInt(e.detail.value);
    const settings = { ...this.data.settings };
    settings.handwriting.angle = angle;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新间距
  updateSpacing: function(e) {
    const spacing = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.handwriting.spacing = spacing;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新纸张类型
  updatePaperType: function(e) {
    const type = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.paper.type = type;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新纸张颜色
  updatePaperColor: function(e) {
    const color = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.paper.color = color;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新纸张纹理
  updatePaperTexture: function(e) {
    const texture = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.paper.texture = texture;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 切换错误模拟
  toggleErrorsEnabled: function(e) {
    const enabled = e.detail.value;
    const settings = { ...this.data.settings };
    settings.errors.enabled = enabled;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新错误频率
  updateErrorFrequency: function(e) {
    const frequency = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.errors.frequency = frequency;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 切换划线错误
  toggleCrossout: function(e) {
    const enabled = e.detail.value;
    const settings = { ...this.data.settings };
    settings.errors.types.crossout = enabled;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 切换涂改错误
  toggleCorrection: function(e) {
    const enabled = e.detail.value;
    const settings = { ...this.data.settings };
    settings.errors.types.correction = enabled;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 切换批注错误
  toggleAnnotation: function(e) {
    const enabled = e.detail.value;
    const settings = { ...this.data.settings };
    settings.errors.types.annotation = enabled;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新导出格式
  updateExportFormat: function(e) {
    const format = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.export.format = format;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新导出尺寸
  updateExportSize: function(e) {
    const size = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.export.size = size;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新导出质量
  updateExportQuality: function(e) {
    const quality = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.export.quality = quality;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 更新导出方向
  updateExportOrientation: function(e) {
    const orientation = e.currentTarget.dataset.value;
    const settings = { ...this.data.settings };
    settings.export.orientation = orientation;
    
    this.setData({ settings });
    app.updateSettings(settings);
  },
  
  // 重置所有设置为默认值
  resetSettings: function() {
    wx.showModal({
      title: '提示',
      content: '确定要恢复默认设置吗？',
      success: res => {
        if (res.confirm) {
          const defaultSettings = app.getDefaultSettings();
          this.setData({
            settings: defaultSettings
          });
          app.updateSettings(defaultSettings);
          
          wx.showToast({
            title: '已恢复默认设置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 返回编辑页
  goToEditPage: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
