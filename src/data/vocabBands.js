// 词汇分档：按词频区间分为 8 档，每档抽样若干代表词。
// 词汇量估算原理：受试者在某档的正确率（去除猜测）≈ 掌握该频段词汇的比例，
// 各档比例 × 档位词汇跨度求和，即为估算词汇量。

export const BANDS = [
  {
    id: 1, from: 0, to: 500, label: '入门（小学低年级）',
    words: [
      ['apple', '苹果'], ['water', '水'], ['happy', '快乐的'], ['run', '跑；奔跑'],
      ['book', '书'], ['family', '家庭'], ['red', '红色的'], ['school', '学校'],
      ['eat', '吃'], ['friend', '朋友'], ['sun', '太阳'], ['door', '门'],
      ['milk', '牛奶'], ['hand', '手'], ['sleep', '睡觉'], ['fish', '鱼'],
      ['sing', '唱歌'], ['cold', '冷的'],
    ],
  },
  {
    id: 2, from: 500, to: 1200, label: '基础（小学高年级）',
    words: [
      ['weather', '天气'], ['library', '图书馆'], ['breakfast', '早餐'], ['vegetable', '蔬菜'],
      ['always', '总是'], ['beautiful', '美丽的'], ['subject', '学科；科目'], ['festival', '节日'],
      ['healthy', '健康的'], ['museum', '博物馆'], ['borrow', '借（入）'], ['dangerous', '危险的'],
      ['quiet', '安静的'], ['travel', '旅行'], ['weekend', '周末'], ['dictionary', '词典'],
      ['exercise', '锻炼；练习'], ['mountain', '山'],
    ],
  },
  {
    id: 3, from: 1200, to: 1800, label: '初一 · 初二',
    words: [
      ['environment', '环境'], ['knowledge', '知识'], ['message', '消息；信息'], ['popular', '受欢迎的'],
      ['improve', '改进；提高'], ['medicine', '药'], ['foreign', '外国的'], ['culture', '文化'],
      ['succeed', '成功'], ['invent', '发明'], ['nervous', '紧张的'], ['protect', '保护'],
      ['habit', '习惯'], ['report', '报告'], ['social', '社会的'], ['produce', '生产；出产'],
      ['wonder', '想知道；好奇'], ['patient', '有耐心的；病人'],
    ],
  },
  {
    id: 4, from: 1800, to: 2600, label: '初三 · 中考',
    words: [
      ['advantage', '优势；有利条件'], ['communicate', '交流；沟通'], ['decision', '决定'], ['familiar', '熟悉的'],
      ['influence', '影响'], ['opportunity', '机会'], ['avoid', '避免'], ['describe', '描述'],
      ['educate', '教育'], ['increase', '增加'], ['organize', '组织'], ['prevent', '防止；阻止'],
      ['recognize', '认出；认识到'], ['suggest', '建议'], ['value', '价值'], ['attitude', '态度'],
      ['challenge', '挑战'], ['achieve', '达成；实现'],
    ],
  },
  {
    id: 5, from: 2600, to: 3500, label: '高中 · 高考',
    words: [
      ['analysis', '分析'], ['appreciate', '感激；欣赏'], ['budget', '预算'], ['campaign', '运动；活动'],
      ['distinguish', '区分；辨别'], ['emergency', '紧急情况'], ['frequent', '频繁的'], ['guarantee', '保证'],
      ['ignore', '忽视'], ['motivation', '动机'], ['occupy', '占据；占用'], ['potential', '潜力；潜在的'],
      ['relevant', '相关的'], ['sacrifice', '牺牲'], ['tendency', '趋势；倾向'], ['urgent', '紧急的'],
      ['witness', '目击者；目睹'], ['approach', '方法；接近'],
    ],
  },
  {
    id: 6, from: 3500, to: 4500, label: '大学四级（CET-4）',
    words: [
      ['abundant', '丰富的；充裕的'], ['acquire', '获得；习得'], ['alternative', '替代的；备选方案'], ['assess', '评估'],
      ['capacity', '容量；能力'], ['consequence', '后果'], ['derive', '源于；得到'], ['eliminate', '消除'],
      ['enhance', '增强；提升'], ['evaluate', '评价'], ['feasible', '可行的'], ['interpret', '解释；口译'],
      ['negotiate', '谈判；协商'], ['obstacle', '障碍'], ['priority', '优先事项'], ['restrict', '限制'],
      ['sufficient', '充足的'], ['transform', '转变；改造'],
    ],
  },
  {
    id: 7, from: 4500, to: 6000, label: '大学六级（CET-6）',
    words: [
      ['alleviate', '缓解；减轻'], ['ambiguous', '模棱两可的'], ['coherent', '连贯的'], ['compensate', '补偿'],
      ['deteriorate', '恶化'], ['discrepancy', '差异；不符'], ['hypothesis', '假说；假设'], ['inevitable', '不可避免的'],
      ['intricate', '错综复杂的'], ['legitimate', '合法的；正当的'], ['manipulate', '操纵'], ['notorious', '臭名昭著的'],
      ['plausible', '貌似合理的'], ['prevalent', '普遍流行的'], ['scrutiny', '仔细审查'], ['subtle', '微妙的'],
      ['undermine', '削弱；暗中破坏'], ['versatile', '多才多艺的；多用途的'],
    ],
  },
  {
    id: 8, from: 6000, to: 9000, label: '高阶（雅思/托福/专八）',
    words: [
      ['aberration', '反常；偏离'], ['capricious', '反复无常的'], ['ephemeral', '短暂的'], ['esoteric', '深奥难懂的'],
      ['meticulous', '一丝不苟的'], ['obfuscate', '使混乱；使费解'], ['pragmatic', '务实的'], ['quintessential', '典型的；精髓的'],
      ['scrupulous', '严谨审慎的'], ['tenuous', '脆弱的；牵强的'], ['ubiquitous', '无处不在的'], ['venerate', '尊崇'],
      ['zealous', '热忱的'], ['equivocal', '含糊其辞的'], ['harbinger', '先兆；预兆'], ['laconic', '言简意赅的'],
      ['perfunctory', '敷衍的'], ['recalcitrant', '桀骜不驯的'],
    ],
  },
]

// 词汇量 → 水平映射（用于出题难度定位）
export const LEVELS = [
  { max: 500, grade: '小学低年级', cefr: 'Pre-A1', difficulty: '非常简单，句子短，词汇限于最常用 500 词' },
  { max: 1000, grade: '小学高年级', cefr: 'A1', difficulty: '简单，使用最常用 1000 词以内词汇' },
  { max: 1600, grade: '初一 · 初二', cefr: 'A2', difficulty: '较简单，词汇不超过初中课标 1600 词' },
  { max: 2200, grade: '初三（中考水平）', cefr: 'A2+/B1', difficulty: '中考难度，词汇约 1600-2200' },
  { max: 3500, grade: '高中（高考水平）', cefr: 'B1/B2', difficulty: '高考难度，词汇约 3500，含长难句' },
  { max: 4500, grade: '大学四级（CET-4）', cefr: 'B2', difficulty: '四级难度，词汇约 4500，学术性话题' },
  { max: 6000, grade: '大学六级（CET-6）', cefr: 'B2+/C1', difficulty: '六级难度，词汇约 6000，抽象论述' },
  { max: Infinity, grade: '雅思/托福/专八', cefr: 'C1/C2', difficulty: '接近母语者的学术文章，长难句与低频词' },
]

export function levelForVocab(size) {
  return LEVELS.find(l => size <= l.max) || LEVELS[LEVELS.length - 1]
}
