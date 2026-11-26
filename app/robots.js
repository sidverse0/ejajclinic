export default function robots() {
  if (process.env.SITE_NOINDEX === '1') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/book/confirmation'] }],
  };
}
