// 14 个故事分类：原 6 大好习惯 + 新增 8 大主题
export const CATS = [
  { id: 'sleep',         name: '按时睡觉', desc: '早睡早起精神好',   color: '#7FA8D9', icon: 'moon' },
  { id: 'brush',         name: '刷牙洗手', desc: '亮牙齿香小手',     color: '#6FC3B0', icon: 'tooth' },
  { id: 'share',         name: '分享礼貌', desc: '会说魔法词',       color: '#E8A06B', icon: 'gift' },
  { id: 'emotion',       name: '情绪管理', desc: '和生气说拜拜',     color: '#C78BC0', icon: 'smile' },
  { id: 'safety',        name: '安全意识', desc: '红灯停绿灯行',     color: '#D98B8B', icon: 'light' },
  { id: 'animals',       name: '爱护动物', desc: '动物是好朋友',     color: '#9BBF7C', icon: 'paw' },
  { id: 'honest',        name: '诚实品格', desc: '做个诚实好孩子',   color: '#8FBBD9', icon: 'heart' },
  { id: 'courage',       name: '勇敢勇气', desc: '勇敢不害怕',       color: '#E0A45C', icon: 'star' },
  { id: 'responsibility',name: '责任担当', desc: '自己的事自己做',   color: '#B59BD9', icon: 'check' },
  { id: 'study',         name: '学习习惯', desc: '爱学习爱动脑',     color: '#7FB8C9', icon: 'book' },
  { id: 'life',          name: '生活习惯', desc: '规律生活身体棒',   color: '#D9B07F', icon: 'sun' },
  { id: 'time',          name: '时间管理', desc: '不拖拉守时间',     color: '#C9A07F', icon: 'clock' },
  { id: 'friendship',    name: '人际交往', desc: '好朋友一起玩',     color: '#D98BB0', icon: 'users' },
  { id: 'science',       name: '科学启蒙', desc: '探索奇妙世界',     color: '#7FC9A0', icon: 'spark' },
  // —— 新增：幼儿园适应 & 社交交往（初入幼儿园 3 岁宝宝）——
  { id: 'kinder',    name: '入园适应',   desc: '第一天也不怕',     color: '#E08A4C', icon: 'school' },
  { id: 'rules',     name: '集体规则',   desc: '排队轮流守秩序',   color: '#C98BD9', icon: 'flag' },
  { id: 'social',    name: '社交交友',   desc: '主动交朋友',       color: '#E07BA0', icon: 'friends' },
  { id: 'conflict',  name: '冲突解决',   desc: '说对不起和好',     color: '#C77F7F', icon: 'peace' },
  { id: 'manners',   name: '礼貌社交',   desc: '请谢谢对不起',     color: '#D9A05C', icon: 'chat' },
  { id: 'express',   name: '表达求助',   desc: '勇敢说出想法',     color: '#6FA0D0', icon: 'mic' },
  { id: 'cooperate', name: '合作互助',   desc: '一起完成的事',     color: '#7FC98C', icon: 'puzzle' },
  { id: 'selfsafe',  name: '自我防护',   desc: '保护自己的身体',   color: '#D98B5C', icon: 'shield' },
  { id: 'empathy',   name: '同理心',     desc: '关心小伙伴',       color: '#C99BD9', icon: 'hug' },
  { id: 'indep',     name: '独立自理',   desc: '自己的事自己做',   color: '#B5A05C', icon: 'shoe' },
  { id: 'hyg',       name: '园内卫生',   desc: '饭前便后洗手',     color: '#6FC3B0', icon: 'soap' },
  { id: 'thanks',    name: '感恩礼貌',   desc: '谢谢老师和同伴',   color: '#D9B05C', icon: 'flower' },
  { id: 'patience',  name: '耐心等待',   desc: '排队不着急',       color: '#8F8FD0', icon: 'hourglass' },
]

export const CAT_MAP = Object.fromEntries(CATS.map(c => [c.id, c]))
export const catName = id => CAT_MAP[id]?.name || '故事'
export const catColor = id => CAT_MAP[id]?.color || '#E8915F'

// 故事 JSON 文件清单（public/stories/ 下）
export const STORY_FILES = [
  'base', 'honest', 'courage', 'responsibility',
  'study', 'life', 'time', 'friendship', 'science',
  'kinder', 'rules', 'social', 'conflict', 'manners', 'express',
  'cooperate', 'selfsafe', 'empathy', 'indep', 'hyg', 'thanks', 'patience'
]
