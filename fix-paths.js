import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const BASE_URL = '/SalesTool/Rudraksh/'
const DIST_DIR = './dist'
const EXTENSIONS = ['.js', '.html', '.css']

function getAllFiles(dir) {
  const files = []
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath))
    } else if (EXTENSIONS.includes(extname(file))) {
      files.push(fullPath)
    }
  }
  return files
}

const files = getAllFiles(DIST_DIR)

const EXCLUDE_PREFIXES = [
  'http', 'https', '//', 
  '/SalesTool', '/Aerial_Panorama', // already fixed paths
]

for (const file of files) {
  let content = readFileSync(file, 'utf-8')

  const updated = content.replace(
    /(['"`])(\/(assets|marzipano|models|textures|images|media|panorama|pano|data|json|files)[^'"`]*)\1/g,
    (match, quote, path) => {
      // Skip already prefixed paths
      if (EXCLUDE_PREFIXES.some(p => path.startsWith(p))) return match
      return `${quote}${BASE_URL}${path.slice(1)}${quote}`
    }
  )

  if (updated !== content) {
    writeFileSync(file, updated)
    console.log(`✅ Fixed: ${file}`)
  }
}

console.log('🎉 All paths fixed!')