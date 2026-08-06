// 校验所有故事 JSON：合法性、字段、分类、id 唯一、晚安结尾
import fs from 'fs'
import path from 'path'

const dir = 'public/stories'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
const seenId = new Map()
let total = 0, errors = []

const expectCat = {
  'base.json': null, // 原故事含多分类
  'honest.json': 'honest', 'courage.json': 'courage', 'responsibility.json': 'responsibility',
  'study.json': 'study', 'life.json': 'life', 'time.json': 'time',
  'friendship.json': 'friendship', 'science.json': 'science',
  'kinder.json': 'kinder', 'rules.json': 'rules', 'social.json': 'social',
  'conflict.json': 'conflict', 'manners.json': 'manners', 'express.json': 'express',
  'cooperate.json': 'cooperate', 'selfsafe.json': 'selfsafe', 'empathy.json': 'empathy',
  'indep.json': 'indep', 'hyg.json': 'hyg', 'thanks.json': 'thanks', 'patience.json': 'patience'
}

for (const f of files) {
  const p = path.join(dir, f)
  let data
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')) }
  catch (e) { errors.push(`${f}: JSON 解析失败 - ${e.message}`); continue }
  if (!data.stories || !Array.isArray(data.stories)) { errors.push(`${f}: 缺少 stories 数组`); continue }
  const exp = expectCat[f]
  data.stories.forEach((s, i) => {
    const at = `${f}#${i}`
    if (!s.id) errors.push(`${at}: 缺 id`)
    if (!s.title) errors.push(`${at}: 缺 title`)
    if (!s.category) errors.push(`${at}(${s.id}): 缺 category`)
    else if (exp && s.category !== exp) errors.push(`${at}(${s.id}): category=${s.category} 应为 ${exp}`)
    if (typeof s.minutes !== 'number') errors.push(`${at}(${s.id}): minutes 非数字`)
    if (!Array.isArray(s.tags) || s.tags.length < 1) errors.push(`${at}(${s.id}): tags 异常`)
    if (!Array.isArray(s.paras) || s.paras.length < 4 || s.paras.length > 8)
      errors.push(`${at}(${s.id}): paras 应为4-8段，实际 ${Array.isArray(s.paras) ? s.paras.length : '非数组'}`)
    else if (!s.paras[s.paras.length - 1].includes('晚安'))
      errors.push(`${at}(${s.id}): 末段缺少「晚安」`)
    if (s.id) {
      if (seenId.has(s.id)) errors.push(`${s.id}: id 重复 (${seenId.get(s.id)} 与 ${f})`)
      else seenId.set(s.id, f)
    }
    total++
  })
}

console.log(`文件数: ${files.length}`)
console.log(`故事总数: ${total}`)
console.log(`分类计数:`, Object.fromEntries(
  files.map(f => [f, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).stories.length])
))
if (errors.length) {
  console.log(`\n❌ 发现 ${errors.length} 个问题:`)
  errors.slice(0, 40).forEach(e => console.log('  - ' + e))
  process.exit(1)
} else {
  console.log('\n✅ 全部校验通过，id 全局唯一，字段完整，分类正确，均含晚安结尾')
}
