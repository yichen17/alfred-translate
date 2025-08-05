import alfy from 'alfy';
import CryptoJS from 'crypto-js';
import errorMap from './error_map.js';
import translate from './translate.js'


const APP_KEY = ''; // 替换为你的 appKey
const APP_SECRET = ''; // 替换为你的 key（注意：暴露密钥有风险！）
// const VOCAB_ID = ''; // 替换为你的 vocabId

const queryStr = alfy.input; 
// const to = 'zh-CHS';
// const from = 'en';

const to = process.env.to;
const from = process.env.from;

// console.log(process.env.name); // 获取环境变量

translate(APP_KEY, APP_SECRET, queryStr, from, to)
  .then(res => {
    const result = [{title:res.translation[0],subtitle:res.translation[0],arg:queryStr}]
    // console.log(result);
    alfy.output(result);
  }, 
  res => {
    const result = [{title:errorMap[res.errorCode],subtitle:errorMap[res.errorCode],arg:queryStr}]
    alfy.output(result);
  });

  
