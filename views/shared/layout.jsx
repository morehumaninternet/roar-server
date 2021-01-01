const React = require('react')
const Header = require('./header')
const Footer = require('./footer')

module.exports = function Layout(props) {
  const title = props.title || 'Roar!'
  const description = props.description || ''
  const stylesheets = typeof props.stylesheets === 'string' ? [props.stylesheets] : (props.stylesheets || [])
  const scripts = typeof props.scripts === 'string' ? [props.scripts] : (props.scripts || [])

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@by_roar" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="msapplication-TileColor" content="#164176" />
        <meta name="theme-color" content="#ffffff" />
        {stylesheets.concat(['normalize.css', 'common.css']).map(href => (
          <link type="text/css" rel="stylesheet" key={href} href={href} />
        ))}
      </head>
      <body>
        <Header />
        <main>
          {props.children}
        </main>
        <Footer />
        {scripts.map(src => (
          <script key={src} src={src} />
        ))}
      </body>
    </html>
  )
}