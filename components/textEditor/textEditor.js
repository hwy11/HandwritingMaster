// components/textEditor/textEditor.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: '请输入文本...'
    },
    maxLength: {
      type: Number,
      value: 5000
    },
    autoHeight: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    textContent: '',
    textCount: 0
  },

  /**
   * 数据监听器
   */
  observers: {
    'value': function(value) {
      // 当外部传入的value变化时，更新内部的textContent
      if (value !== this.data.textContent) {
        this.setData({
          textContent: value,
          textCount: value.length
        });
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 处理输入事件
     */
    handleInput: function(e) {
      const value = e.detail.value;
      const count = value.length;
      
      this.setData({
        textContent: value,
        textCount: count
      });
      
      // 触发外部绑定的输入事件
      this.triggerEvent('input', { value });
    },
    
    /**
     * 处理聚焦事件
     */
    handleFocus: function(e) {
      this.triggerEvent('focus', e.detail);
    },
    
    /**
     * 处理失焦事件
     */
    handleBlur: function(e) {
      this.triggerEvent('blur', e.detail);
    },
    
    /**
     * 处理确认事件（回车）
     */
    handleConfirm: function(e) {
      this.triggerEvent('confirm', e.detail);
    },
    
    /**
     * 处理清空内容
     */
    clearContent: function() {
      this.setData({
        textContent: '',
        textCount: 0
      });
      
      // 触发输入事件，同步到外部
      this.triggerEvent('input', { value: '' });
    },
    
    /**
     * 处理粘贴事件
     */
    handlePaste: function(e) {
      this.triggerEvent('paste', e.detail);
    }
  }
});
