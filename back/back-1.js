import alfy from 'alfy';
import CryptoJS from 'crypto-js';
import errorMap from './error_map.js';


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
const translate = (appKey, key, ttt, from, to,) => {
  const salt = Date.now();
  const curtime = Math.round(Date.now() / 1000);
  const str1 = `${appKey}${truncate(ttt)}${salt}${curtime}${key}`;

  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
  const url = 'https://openapi.youdao.com/api';

  const data = {
      q: ttt,
      appKey,
      salt,
      from,
      to,
      sign,
      signType: 'v3',
      curtime,
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

const APP_KEY = '20a486216e1cb35b'; // 替换为你的 appKey
const APP_SECRET = 'k7i0hQ7sKHG1Yg3p63Ez1M68fq5UxnPC'; // 替换为你的 key（注意：暴露密钥有风险！）
// const VOCAB_ID = ''; // 替换为你的 vocabId

const ttt = alfy.input;
const to = 'zh-CHS';
const from = 'en';

console.log(alfy.userConfig.get('name'))

translate(APP_KEY, APP_SECRET, ttt, from, to)
  .then(res => {
    const result = [{title:res.translation[0],subtitle:res.translation[0],arg:ttt}]
    // console.log(result);
    alfy.output(result);
  }, 
  res => {
    const result = [{title:errorMap[res.errorCode],subtitle:errorMap[res.errorCode],arg:ttt}]
    alfy.output(result);
  });

  