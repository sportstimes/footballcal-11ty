const config = {
  POSTHOG_KEY: 'phc_JdP4Pzr615wYq8B0fT0wCK3dPL8yszZIOWOsSAM2Fad',
  POSTHOG_HOST: 'https://eu.i.posthog.com',
  GOOGLE_ADSENSE_PUBLISHER_ID: process.env.GOOGLE_ADSENSE_PUBLISHER_ID || '',
  GOOGLE_ADSENSE_SLOT_GAME: process.env.GOOGLE_ADSENSE_SLOT_GAME || '',
  GOOGLE_ADSENSE_SLOT_COMPETITION: process.env.GOOGLE_ADSENSE_SLOT_COMPETITION || ''
}

module.exports = () => {
  if (process.env.ELEVENTY_BASE_URL) {
    config.baseUrl = process.env.ELEVENTY_BASE_URL
  }

  if (process.env.GITHUB_REPOSITORY_OWNER) {
    config.baseUrl = `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io`
  }

  // https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
  if (process.env.URL) {
    config.baseUrl = process.env.URL
  }

  // https://vercel.com/docs/v2/build-step#system-environment-variables
  if (process.env.VERCEL_URL) {
    config.baseUrl = process.env.VERCEL_URL
  }

  // https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables
  if (process.env.GITHUB_URL) {
    config.baseUrl = process.env.GITHUB_URL
  }

  // https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
  // CF_PAGES_URL is always the deployment's unique *.pages.dev subdomain, even for
  // production builds on the custom domain — so only use it for preview/branch builds.
  // Production (the main branch) must always use footballcal.com.
  if (process.env.CF_PAGES_URL && process.env.CF_PAGES_BRANCH !== 'main') {
    config.baseUrl = process.env.CF_PAGES_URL
  }

  if (!config.baseUrl) {
    config.baseUrl = 'https://footballcal.com'
  }

  return config
}
