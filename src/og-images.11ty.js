const path = require('path')
const fs = require('fs')
const satori = require('satori').default
const { Resvg } = require('@resvg/resvg-js')
const { DateTime } = require('luxon')

const fontBlack = fs.readFileSync(path.join(__dirname, '_assets/fonts/RobotoSlab-Black.woff'))

const logoBase64 = fs.readFileSync(
  path.join(__dirname, '_assets/img/footballcal-128.png')
).toString('base64')
const logoSrc = `data:image/png;base64,${logoBase64}`

// Diagonal split coordinates from linear-gradient(120deg, A 50%, B 50%) on 1200x630
// Perpendicular to 120deg gradient line through centre (600,315):
//   top edge at x~782, bottom edge at x~418
const DIAG_TOP_X = 782
const DIAG_BOT_X = 418

function hex (colour, fallback = '#888888') {
  return colour || fallback
}

function buildCard (game, teams, competitions) {
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

  const homeFifa = homeTeam.fifaCode || home.slice(0, 3).toUpperCase()
  const awayFifa = awayTeam.fifaCode || away.slice(0, 3).toUpperCase()

  const competition = (competitions || []).find(c => data.path && data.path.startsWith(c.path))
  const competitionLabel = competition ? competition.title.toUpperCase() : ''

  let dateStr = ''
  let timeStr = ''
  if (data.date) {
    const dt = DateTime.fromISO(data.date).toUTC()
    dateStr = dt.toFormat('ccc d MMM yyyy')
    timeStr = dt.toFormat('HH:mm') + ' UTC'
  }

  const WATERMARK_OPACITY = 0.45

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        position: 'relative',
        width: '1200px',
        height: '630px',
        fontFamily: '"Roboto Slab"',
        backgroundColor: '#0d0d1a',
        overflow: 'hidden'
      },
      children: [
        {
          type: 'svg',
          props: {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 1200 630',
            width: '1200',
            height: '630',
            style: { position: 'absolute', top: '0px', left: '0px' },
            children: [
              {
                type: 'polygon',
                props: {
                  points: `0,0 ${DIAG_TOP_X},0 ${DIAG_BOT_X},630 0,630`,
                  fill: homePrimary
                }
              },
              {
                type: 'polygon',
                props: {
                  points: `${DIAG_TOP_X},0 1200,0 1200,630 ${DIAG_BOT_X},630`,
                  fill: awayPrimary
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              left: '0px',
              top: '0px',
              width: '400px',
              height: '630px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '84px',
                    fontWeight: 900,
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
                    fontSize: '22px',
                    fontWeight: 900,
                    color: homeSecondary,
                    textAlign: 'center',
                    marginTop: '16px',
                    lineHeight: 1.3,
                    opacity: 0.85
                  },
                  children: home
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              right: '0px',
              top: '0px',
              width: '400px',
              height: '630px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '84px',
                    fontWeight: 900,
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
                    fontSize: '22px',
                    fontWeight: 900,
                    color: awaySecondary,
                    textAlign: 'center',
                    marginTop: '16px',
                    lineHeight: 1.3,
                    opacity: 0.85
                  },
                  children: away
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              left: '400px',
              top: '0px',
              width: '400px',
              height: '630px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(13,13,26,0.72)'
            },
            children: [
              // Row 1 — competition
              {
                type: 'div',
                props: {
                  style: {
                    width: '400px',
                    height: '210px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '20px',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '5px',
                        opacity: WATERMARK_OPACITY,
                        textAlign: 'center'
                      },
                      children: competitionLabel
                    }
                  }
                }
              },
              // Row 2 — date + time
              {
                type: 'div',
                props: {
                  style: {
                    width: '400px',
                    height: '210px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '44px',
                          fontWeight: 900,
                          color: '#aaaacc',
                          textAlign: 'center',
                          letterSpacing: '2px',
                          lineHeight: 1
                        },
                        children: dateStr
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '42px',
                          fontWeight: 900,
                          color: '#ffffff',
                          textAlign: 'center',
                          letterSpacing: '3px',
                          lineHeight: 1,
                          marginTop: '14px'
                        },
                        children: timeStr
                      }
                    }
                  ]
                }
              },
              // Row 3 — watermark
              {
                type: 'div',
                props: {
                  style: {
                    width: '400px',
                    height: '210px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10px',
                        opacity: WATERMARK_OPACITY
                      },
                      children: [
                        {
                          type: 'img',
                          props: {
                            src: logoSrc,
                            width: '28',
                            height: '28',
                            style: { filter: 'invert(1)' }
                          }
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              fontSize: '22px',
                              fontWeight: 900,
                              color: '#ffffff',
                              letterSpacing: '2px'
                            },
                            children: 'footballcal.com'
                          }
                        }
                      ]
                    }
                  }
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

  async render ({ game, teams, competitions }) {
    const card = buildCard(game, teams, competitions)
    const fonts = [
      { name: 'Roboto Slab', data: fontBlack, weight: 900, style: 'normal' }
    ]

    const svg = await satori(card, { width: 1200, height: 630, fonts })
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    return Buffer.from(resvg.render().asPng())
  }
}
