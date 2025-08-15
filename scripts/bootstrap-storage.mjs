import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !service) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function ensureBucket(name, publicBucket = true) {
  const existing = await admin.storage.getBucket(name)
  if (existing?.data) {
    console.log(`Bucket "${name}" already exists`)
    return
  }
  const { data, error } = await admin.storage.createBucket(name, {
    public: publicBucket,
    fileSizeLimit: '20MB'
  })
  if (error) {
    console.error(`Create bucket "${name}" failed:`, error.message)
    process.exit(1)
  }
  console.log(`Created bucket "${name}"`, data)
}

async function main() {
  await ensureBucket('consortium_logos', true)
  await ensureBucket('innovation-logos', true)
  await ensureBucket('event-logos', true)
  console.log('All buckets ensured.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
