// components/stylesSelector/stylesSelector.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 当前选中的样式ID
    selectedStyle: {
      type: String,
      value: ''
    },
    // 样式选项列表
    options: {
      type: Array,
      value: []
    },
    // 选择器类型：style为字体风格，paper为纸张背景
    type: {
      type: String,
      value: 'style'
    },
    // 选择器标题
    title: {
      type: String,
      value: '选择样式'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isExpanded: false // 是否展开选项
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换展开/收起状态
    toggleExpand: function() {
      this.setData({
        isExpanded: !this.data.isExpanded
      });
    },
    
    // 选择样式
    selectOption: function(e) {
      const optionId = e.currentTarget.dataset.id;
      
      // 防止重复选择同一选项
      if (optionId === this.properties.selectedStyle) {
        this.setData({ isExpanded: false });
        return;
      }
      
      // 触发选择事件
      this.triggerEvent('select', { id: optionId, type: this.properties.type });
      
      // 收起选项列表
      this.setData({ isExpanded: false });
    },
    
    // 获取当前选中的选项名称
    getSelectedName: function() {
      const { options, selectedStyle } = this.properties;
      const selected = options.find(item => item.id === selectedStyle);
      return selected ? selected.name : '';
    }
  }
});
