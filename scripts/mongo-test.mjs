import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('请先设置环境变量 MONGODB_URI')
  console.error('方式1：vercel env pull')
  console.error('方式2：MONGODB_URI="xxx" node scripts/mongo-test.mjs')
  process.exit(1)
}

const client = new MongoClient(uri, { connectTimeoutMS: 8000, serverSelectionTimeoutMS: 8000 })

try {
  await client.connect()
  console.log('✅ 已连接到 MongoDB\n')

  const admin = client.db().admin()
  const { databases } = await admin.listDatabases()
  console.log(`共 ${databases.length} 个数据库：\n`)

  for (const dbInfo of databases) {
    const db = client.db(dbInfo.name)
    let collections = []
    try {
      collections = await db.listCollections().toArray()
    } catch (e) {
      console.log(`  [${dbInfo.name}] 列出集合失败：${e.message}`)
      continue
    }

    console.log(`📁 ${dbInfo.name}`)
    console.log(`   sizeOnDisk: ${dbInfo.sizeOnDisk || 0} bytes`)
    if (collections.length === 0) {
      console.log('   （无集合）')
    } else {
      for (const c of collections) {
        console.log(`   └─ 集合: ${c.name}  (${c.type || 'collection'})`)
      }
    }
    console.log('')
  }
} catch (err) {
  console.error('❌ 连接失败：', err.message)
  process.exit(1)
} finally {
  await client.close().catch(() => {})
}
