import alfy from 'alfy';
import CryptoJS from 'crypto-js';


/**
 * 截断查询字符串
 * @param {string} q - 待翻译文本
 * @returns {string} - 截断后的字符串
 */
const truncate = (q) => {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
};

/**
 * 发起翻译请求
 * @param {string} appKey - 应用ID
 * @param {string} key - 应用密钥
 * @param {string} query - 待翻译文本
 * @param {string} from - 源语言
 * @param {string} to - 目标语言
 * @returns {Promise} - 翻译结果
 */
const translate = (appKey, key, query, from, to,) => {
  const salt = Date.now();
  const curtime = Math.round(Date.now() / 1000);
  const str1 = `${appKey}${truncate(query)}${salt}${curtime}${key}`;

  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
  const url = 'https://openapi.youdao.com/api';

  const data = {
      q: query,
      appKey,
      salt,
      from,
      to,
      sign,
      signType: 'v3',
      curtime,
      strict: 'true'
    };

    // console.log(JSON.stringify(data));
    // console.log(data.toString());

    // 创建 URLSearchParams 实例
    const formData = new URLSearchParams();

    // 遍历对象并添加字段
    for (const [k, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) { // 排除未定义/空值
        formData.append(k, value.toString());
    }
    }

    // 转换为表单字符串（如 q=hello&appKey=xxx...）
    const formDataString = formData.toString();
    // console.log(formDataString)


     return   alfy.fetch(url,{
        // method: 'POST',
        // body: JSON.stringify(data),
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formDataString

     })
     .then(res => {
			return new Promise((success, fail) => {
				res.errorCode != 0 ?  fail(res) : success(res)
			});
		})
};

export default translate;
  