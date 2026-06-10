#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const gamesDir = path.join(__dirname, 'src/_content/games/world-cup-2026')

// Confirmed BBC/ITV per-game channel split for all 72 group stage games
const ukChannels = {
  'mexico-south-africa':              ['ITV1', 'ITVX'],
  'south-korea-czechia':              ['ITV1', 'ITVX'],
  'canada-bosnia-and-herzegovina':    ['BBC One', 'BBC iPlayer'],
  'usa-paraguay':                     ['BBC One', 'BBC iPlayer'],
  'qatar-switzerland':                ['ITV1', 'ITVX'],
  'brazil-morocco':                   ['BBC One', 'BBC iPlayer'],
  'haiti-scotland':                   ['BBC One', 'BBC iPlayer'],
  'australia-turkiye':                ['ITV1', 'ITVX'],
  'germany-curacao':                  ['ITV1', 'ITVX'],
  'netherlands-japan':                ['ITV1', 'ITVX'],
  'ivory-coast-ecuador':              ['BBC One', 'BBC iPlayer'],
  'sweden-tunisia':                   ['ITV1', 'ITVX'],
  'spain-cape-verde':                 ['ITV1', 'ITVX'],
  'belgium-egypt':                    ['BBC One', 'BBC iPlayer'],
  'saudi-arabia-uruguay':             ['ITV1', 'ITVX'],
  'iran-new-zealand':                 ['BBC One', 'BBC iPlayer'],
  'france-senegal':                   ['BBC One', 'BBC iPlayer'],
  'iraq-norway':                      ['BBC One', 'BBC iPlayer'],
  'argentina-algeria':                ['ITV1', 'ITVX'],
  'austria-jordan':                   ['BBC One', 'BBC iPlayer'],
  'portugal-dr-congo':                ['BBC One', 'BBC iPlayer'],
  'england-croatia':                  ['ITV1', 'ITVX'],
  'ghana-panama':                     ['ITV1', 'ITVX'],
  'uzbekistan-colombia':              ['BBC One', 'BBC iPlayer'],
  'czechia-south-africa':             ['BBC One', 'BBC iPlayer'],
  'switzerland-bosnia-and-herzegovina': ['ITV1', 'ITVX'],
  'canada-qatar':                     ['ITV1', 'ITVX'],
  'mexico-south-korea':               ['BBC Two', 'BBC iPlayer'],
  'usa-australia':                    ['BBC One', 'BBC iPlayer'],
  'scotland-morocco':                 ['ITV1', 'ITVX', 'STV', 'STV Player'],
  'brazil-haiti':                     ['ITV1', 'ITVX'],
  'turkiye-paraguay':                 ['ITV1', 'ITVX'],
  'netherlands-sweden':               ['BBC One', 'BBC iPlayer'],
  'germany-ivory-coast':              ['ITV1', 'ITVX'],
  'ecuador-curacao':                  ['BBC One', 'BBC iPlayer'],
  'tunisia-japan':                    ['BBC One', 'BBC iPlayer'],
  'spain-saudi-arabia':               ['BBC One', 'BBC iPlayer'],
  'belgium-iran':                     ['ITV1', 'ITVX'],
  'uruguay-cape-verde':               ['BBC One', 'BBC iPlayer'],
  'new-zealand-egypt':                ['ITV1', 'ITVX'],
  'argentina-austria':                ['BBC One', 'BBC iPlayer'],
  'france-iraq':                      ['BBC One', 'BBC iPlayer'],
  'norway-senegal':                   ['ITV1', 'ITVX'],
  'jordan-algeria':                   ['ITV1', 'ITVX'],
  'portugal-uzbekistan':              ['ITV1', 'ITVX'],
  'england-ghana':                    ['BBC One', 'BBC iPlayer'],
  'panama-croatia':                   ['BBC One', 'BBC iPlayer'],
  'colombia-dr-congo':                ['ITV1', 'ITVX'],
  // Final round simultaneous pairs
  'switzerland-canada':               ['ITV1', 'ITVX'],
  'bosnia-and-herzegovina-qatar':     ['ITV4', 'ITVX'],
  'scotland-brazil':                  ['BBC One', 'BBC iPlayer'],
  'morocco-haiti':                    ['BBC Two', 'BBC iPlayer'],
  'mexico-czechia':                   ['BBC One', 'BBC iPlayer'],
  'south-africa-south-korea':         ['BBC Two', 'BBC iPlayer'],
  'ecuador-germany':                  ['BBC One', 'BBC iPlayer'],
  'curacao-ivory-coast':              ['BBC Two', 'BBC iPlayer'],
  'japan-sweden':                     ['BBC One', 'BBC iPlayer'],
  'tunisia-netherlands':              ['BBC Two', 'BBC iPlayer'],
  'turkiye-usa':                      ['ITV1', 'ITVX'],
  'paraguay-australia':               ['ITV4', 'ITVX'],
  'norway-france':                    ['ITV1', 'ITVX'],
  'senegal-iraq':                     ['ITV4', 'ITVX'],
  'uruguay-spain':                    ['ITV1', 'ITVX'],
  'cape-verde-saudi-arabia':          ['ITV4', 'ITVX'],
  'egypt-iran':                       ['BBC Two', 'BBC iPlayer'],
  'new-zealand-belgium':              ['BBC One', 'BBC iPlayer'],
  'croatia-ghana':                    ['BBC Two', 'BBC iPlayer'],
  'panama-england':                   ['ITV1', 'ITVX'],
  'colombia-portugal':                ['BBC One', 'BBC iPlayer'],
  'dr-congo-uzbekistan':              ['BBC Two', 'BBC iPlayer'],
  'jordan-argentina':                 ['BBC One', 'BBC iPlayer'],
  'algeria-austria':                  ['BBC Two', 'BBC iPlayer'],
}

const intlChannels = ['FOX', 'FS1', 'Telemundo', 'Peacock', 'TSN', 'CTV', 'RDS', 'DSports']

// Regional extras — preserved if already present in the file
const regionalChannels = [
  'TV Globo', 'CazéTV', 'SporTV',         // Brazil
  'TyC Sports', 'Telefe', 'TV Pública',   // Argentina
  'Caracol TV', 'RCN',                    // Colombia
  'Canal 5',                              // Uruguay
]

const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('.md'))
let updated = 0, skipped = 0

for (const file of files) {
  const slug = file.replace('.md', '')
  const uk = ukChannels[slug]

  if (!uk) {
    console.warn(`⚠️  No channel mapping for: ${file}`)
    skipped++
    continue
  }

  const filePath = path.join(gamesDir, file)
  const content = fs.readFileSync(filePath, 'utf8')

  const tvMatch = content.match(/^tv:\s*\[([^\]]*)\]/m)
  if (!tvMatch) {
    console.warn(`⚠️  No tv field in: ${file}`)
    skipped++
    continue
  }

  const currentTv = tvMatch[1]
  const extras = regionalChannels.filter(ch => currentTv.includes(`"${ch}"`))

  const newTv = [...uk, ...intlChannels, ...extras]
  const newTvStr = `tv: [${newTv.map(ch => `"${ch}"`).join(', ')}]`
  const newContent = content.replace(/^tv:\s*\[[^\]]*\]/m, newTvStr)

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent)
    console.log(`✅ ${file.padEnd(50)} → ${uk.join(', ')}`)
    updated++
  }
}

console.log(`\nDone: ${updated} files updated, ${skipped} skipped`)
