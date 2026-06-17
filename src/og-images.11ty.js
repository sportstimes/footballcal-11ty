const path = require('path')
const fs = require('fs')
const satori = require('satori').default
const { Resvg } = require('@resvg/resvg-js')
const { DateTime } = require('luxon')

const fontRobotoSlab = fs.readFileSync(path.join(__dirname, '_assets/fonts/RobotoSlab-Bold.woff'))
const fontInterRegular = fs.readFileSync(path.join(__dirname, '_assets/fonts/Inter-Regular.woff'))

const logoData = fs.readFileSync(path.join(__dirname, '_assets/img/footballcal-128.png'))
const logoDataUri = 'data:image/png;base64,' + logoData.toString('base64')

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
  const competitionName = competition ? competition.title.toUpperCase() : ''

  let dateStr = ''
  let timeStr = ''
  if (data.date) {
    const dt = DateTime.fromISO(data.date).toUTC()
    dateStr = dt.toFormat('cccc d MMMM yyyy')
    timeStr = dt.toFormat('HH:mm') + ' UTC'
  }

  const teamPanelStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '420px',
    height: '630px',
    padding: '40px'
  }

  const fifaCodeStyle = {
    fontSize: '84px',
    fontWeight: 700,
    fontFamily: '"Roboto Slab"',
    letterSpacing: '4px',
    lineHeight: 1
  }

  const teamNameStyle = {
    fontSize: '22px',
    fontWeight: 700,
    fontFamily: '"Roboto Slab"',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: 1.3,
    opacity: 0.85
  }

  // 1200×630 card
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: '1200px',
        height: '630px',
        fontFamily: '"Roboto Slab"',
        backgroundColor: '#0d0d1a'
      },
      children: [
        // Home team panel
        {
          type: 'div',
          props: {
            style: { ...teamPanelStyle, backgroundColor: homePrimary },
            children: [
              {
                type: 'div',
                props: {
                  style: { ...fifaCodeStyle, color: homeSecondary },
                  children: homeFifa
                }
              },
              {
                type: 'div',
                props: {
                  style: { ...teamNameStyle, color: homeSecondary },
                  children: home
                }
              }
            ]
          }
        },
        // Centre panel — relative so competition + watermark can be absolute
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flex: 1,
              height: '630px',
              backgroundColor: '#0d0d1a'
            },
            children: [
              // Competition name — anchored to top
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    top: '32px',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: '"Roboto Slab"',
                    color: '#666688',
                    letterSpacing: '3px'
                  },
                  children: competitionName
                }
              },
              // "v" — flex-centred, aligns with FIFA codes
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '56px',
                    fontWeight: 700,
                    fontFamily: '"Roboto Slab"',
                    color: '#ffffff',
                    letterSpacing: '2px',
                    lineHeight: 1
                  },
                  children: 'v'
                }
              },
              // Date + time — pushed down from "v"
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '40px'
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '19px',
                          fontWeight: 400,
                          fontFamily: '"Inter"',
                          color: '#9999bb',
                          textAlign: 'center',
                          lineHeight: 1.4
                        },
                        children: dateStr
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '28px',
                          fontWeight: 700,
                          fontFamily: '"Roboto Slab"',
                          color: '#ffffff',
                          textAlign: 'center',
                          marginTop: '8px',
                          lineHeight: 1
                        },
                        children: timeStr
                      }
                    }
                  ]
                }
              },
              // Watermark — anchored to bottom, logo + URL
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    bottom: '26px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '8px'
                  },
                  children: [
                    {
                      type: 'img',
                      props: {
                        src: logoDataUri,
                        width: 24,
                        height: 24,
                        style: { opacity: 0.5 }
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '17px',
                          fontWeight: 700,
                          fontFamily: '"Roboto Slab"',
                          color: '#666688',
                          letterSpacing: '0.5px'
                        },
                        children: 'footballcal.com'
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        // Away team panel
        {
          type: 'div',
          props: {
            style: { ...teamPanelStyle, backgroundColor: awayPrimary },
            children: [
              {
                type: 'div',
                props: {
                  style: { ...fifaCodeStyle, color: awaySecondary },
                  children: awayFifa
                }
              },
              {
                type: 'div',
                props: {
                  style: { ...teamNameStyle, color: awaySecondary },
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

  async render ({ game, teams, competitions }) {
    const card = buildCard(game, teams, competitions)
    const fonts = [
      { name: 'Roboto Slab', data: fontRobotoSlab, weight: 700, style: 'normal' },
      { name: 'Inter', data: fontInterRegular, weight: 400, style: 'normal' }
    ]

    const svg = await satori(card, { width: 1200, height: 630, fonts })
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    return Buffer.from(resvg.render().asPng())
  }
}
