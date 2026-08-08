import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const uri = process.env.MONGODB_URI
  if (!uri) {
    return res.status(500).json({
      error: 'MONGODB_URI is not set',
      hint: 'Vercel MongoDB Native Integration should inject this automatically. You can also set it in Vercel Project Settings > Environment Variables.'
    })
  }

  const client = new MongoClient(uri, { connectTimeoutMS: 8000, serverSelectionTimeoutMS: 8000 })

  try {
    await client.connect()

    const admin = client.db().admin()
    const dbsResult = await admin.listDatabases()

    const databases = []
    for (const dbInfo of dbsResult.databases) {
      const dbName = dbInfo.name
      const db = client.db(dbName)
      let collections = []
      try {
        collections = (await db.listCollections().toArray()).map(c => ({
          name: c.name,
          type: c.type || 'collection'
        }))
      } catch (e) {
        collections = [{ name: '(permission denied: ' + e.message + ')', type: 'error' }]
      }

      databases.push({
        name: dbName,
        sizeOnDisk: dbInfo.sizeOnDisk,
        empty: dbInfo.empty,
        collections
      })
    }

    res.json({ ok: true, databases })
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack })
  } finally {
    await client.close().catch(() => {})
  }
}
