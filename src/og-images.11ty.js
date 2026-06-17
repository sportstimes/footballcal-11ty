const path = require('path')
const fs = require('fs')
const satori = require('satori').default
const { Resvg } = require('@resvg/resvg-js')
const { DateTime } = require('luxon')

const fontBold = fs.readFileSync(path.join(__dirname, '_assets/fonts/Inter-Bold.woff'))
const fontRegular = fs.readFileSync(path.join(__dirname, '_assets/fonts/Inter-Regular.woff'))

function hex (colour, fallback = '#888888') {
  return colour || fallback
}

function buildCard (game, teams) {
  const data = game.data
  const competitors = data.competitors || []
  const home = competitors[0] || ''
  const away = competitors[1] || ''

  const homeTeam = teams[home] || {}
  const awayTeam = teams[away] || {}

  const homePrimary = hex(homeTeam.colours && homeTeam.colours.primary, '#444455')
  const homeSecondary = hex(homeTeam.colours && homeTeam.colours.secondary, '#ffffff')
  const awayPrimary = hex(awayTeam.colours && awayTeam.colours.primary, '#554444')
  const awaySecondary = hex(awayTeam.colours && awayTeam.colours.secondary, '#ffffff')

  const homeFifa = (homeTeam.fifaCode || home.slice(0, 3).toUpperCase())
  const awayFifa = (awayTeam.fifaCode || away.slice(0, 3).toUpperCase())

  let dateStr = ''
  let timeStr = ''
  if (data.date) {
    const dt = DateTime.fromISO(data.date).toUTC()
    dateStr = dt.toFormat('cccc d MMMM yyyy')
    timeStr = dt.toFormat('HH:mm') + ' UTC'
  }

  // 1200×630 card
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: '1200px',
        height: '630px',
        fontFamily: '"Inter"',
        backgroundColor: '#0d0d1a'
      },
      children: [
        // Home team panel
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '420px',
              height: '630px',
              backgroundColor: homePrimary,
              padding: '40px'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '80px',
                    fontWeight: 700,
                    color: homeSecondary,
                    letterSpacing: '4px',
                    lineHeight: 1
                  },
                  children: homeFifa
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 700,
                    color: homeSecondary,
                    textAlign: 'center',
                    marginTop: '16px',
                    lineHeight: 1.3,
                    opacity: 0.9
                  },
                  children: home
                }
              }
            ]
          }
        },
        // Centre panel
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '630px',
              padding: '32px 24px',
              backgroundColor: '#0d0d1a'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '52px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '2px',
                    lineHeight: 1
                  },
                  children: 'v'
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#aaaacc',
                    textAlign: 'center',
                    marginTop: '32px',
                    lineHeight: 1.5
                  },
                  children: dateStr
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '30px',
                    fontWeight: 700,
                    color: '#ffffff',
                    textAlign: 'center',
                    marginTop: '8px',
                    lineHeight: 1
                  },
                  children: timeStr
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    bottom: '28px',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#666688',
                    letterSpacing: '1px'
                  },
                  children: 'footballcal.com'
                }
              }
            ]
          }
        },
        // Away team panel
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '420px',
              height: '630px',
              backgroundColor: awayPrimary,
              padding: '40px'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '80px',
                    fontWeight: 700,
                    color: awaySecondary,
                    letterSpacing: '4px',
                    lineHeight: 1
                  },
                  children: awayFifa
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 700,
                    color: awaySecondary,
                    textAlign: 'center',
                    marginTop: '16px',
                    lineHeight: 1.3,
                    opacity: 0.9
                  },
                  children: away
                }
              }
            ]
          }
        }
      ]
    }
  }
}

module.exports = class OgImages {
  data () {
    return {
      layout: null,
      pagination: {
        data: 'collections.webcal-game',
        size: 1,
        alias: 'game'
      },
      permalink: function (data) {
        const slug = data.game.data.path.replace(/^\/|\/$/g, '').replace(/\//g, '-')
        return '/img/og/' + slug + '.png'
      },
      eleventyExcludeFromCollections: true
    }
  }

  async render ({ game, teams }) {
    const card = buildCard(game, teams)
    const fonts = [
      { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' }
    ]

    const svg = await satori(card, { width: 1200, height: 630, fonts })
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    return Buffer.from(resvg.render().asPng())
  }
}
