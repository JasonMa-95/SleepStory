// 从 git 历史里的旧单文件 index.html 提取 9 个原故事，转成 public/stories/base.json
import fs from 'fs'

const html = fs.readFileSync('legacy-index.html', 'utf8')
const start = html.indexOf('const STORIES')
const open = html.indexOf('[', start)
let depth = 0, end = -1
for (let i = open; i < html.length; i++) {
  const ch = html[i]
  if (ch === '[') depth++
  else if (ch === ']') { depth--; if (depth === 0) { end = i; break } }
}
const arr = eval(html.slice(open, end + 1)) // 旧数据是纯对象字面量，安全
fs.mkdirSync('public/stories', { recursive: true })
fs.writeFileSync('public/stories/base.json', JSON.stringify({ stories: arr }, null, 2))
console.log('已写入', arr.length, '个故事到 public/stories/base.json')
