// utils/api.js

/**
 * 云函数调用相关 API 封装
 */

/**
 * 调用生成手写效果的云函数
 * @param {String} text - 要转换的文本内容
 * @param {Object} settings - 设置选项
 * @return {Promise} 返回云函数执行结果的 Promise
 */
const generateHandwriting = (text, settings) => {
  return wx.cloud.callFunction({
    name: 'generateHandwriting',
    data: {
      text,
      settings
    }
  });
};

/**
 * 调用生成 PDF 的云函数
 * @param {String} imageFileId - 云存储中的图片文件 ID
 * @param {Object} settings - 设置选项
 * @return {Promise} 返回云函数执行结果的 Promise
 */
const generatePdf = (imageFileId, settings) => {
  return wx.cloud.callFunction({
    name: 'generatePdf',
    data: {
      imageFileId,
      settings
    }
  });
};

/**
 * 获取文件临时访问 URL
 * @param {String|Array} fileIds - 云存储文件 ID 或 ID 数组
 * @return {Promise} 返回获取临时 URL 的 Promise
 */
const getTempFileURL = (fileIds) => {
  // 确保 fileIds 是数组
  const fileList = Array.isArray(fileIds) ? fileIds : [fileIds];
  
  return wx.cloud.getTempFileURL({
    fileList
  });
};

/**
 * 下载云存储文件
 * @param {String} fileId - 云存储文件 ID
 * @return {Promise} 返回下载文件的 Promise
 */
const downloadFile = (fileId) => {
  return new Promise((resolve, reject) => {
    // 先获取临时访问 URL
    getTempFileURL(fileId).then(res => {
      if (res.fileList && res.fileList.length > 0) {
        const tempUrl = res.fileList[0].tempFileURL;
        
        // 下载文件
        wx.downloadFile({
          url: tempUrl,
          success: downloadRes => {
            if (downloadRes.statusCode === 200) {
              resolve(downloadRes.tempFilePath);
            } else {
              reject(new Error('Download failed with status: ' + downloadRes.statusCode));
            }
          },
          fail: err => {
            reject(err);
          }
        });
      } else {
        reject(new Error('Failed to get temp URL'));
      }
    }).catch(err => {
      reject(err);
    });
  });
};

/**
 * 保存图片到相册
 * @param {String} filePath - 本地文件路径
 * @return {Promise} 返回保存操作的 Promise
 */
const saveImageToPhotosAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * 保存云存储图片到相册
 * @param {String} fileId - 云存储文件 ID
 * @return {Promise} 返回保存操作的 Promise
 */
const saveCloudImageToPhotosAlbum = (fileId) => {
  return downloadFile(fileId).then(tempFilePath => {
    return saveImageToPhotosAlbum(tempFilePath);
  });
};

/**
 * 打开 PDF 文档
 * @param {String} filePath - PDF 文件本地路径
 * @return {Promise} 返回打开文档的 Promise
 */
const openPdfDocument = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.openDocument({
      filePath,
      fileType: 'pdf',
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * 下载并打开云存储 PDF 文档
 * @param {String} fileId - 云存储文件 ID
 * @return {Promise} 返回操作的 Promise
 */
const openCloudPdf = (fileId) => {
  return downloadFile(fileId).then(tempFilePath => {
    return openPdfDocument(tempFilePath);
  });
};

// 导出所有 API 函数
module.exports = {
  generateHandwriting,
  generatePdf,
  getTempFileURL,
  downloadFile,
  saveImageToPhotosAlbum,
  saveCloudImageToPhotosAlbum,
  openPdfDocument,
  openCloudPdf
};
