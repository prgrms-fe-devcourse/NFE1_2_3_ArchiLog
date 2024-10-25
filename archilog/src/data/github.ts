export const GITHUB_CONFIG = {
  API_URL: 'https://api.github.com',
  OAUTH_URL: 'https://github.com/login/oauth/authorize',
  CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  REDIRECT_URI: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI
};