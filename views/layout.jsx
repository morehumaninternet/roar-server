const React = require('react')

module.exports = function Layout(props) {
  const title = props.title || 'Roar!'
  const description = props.description || ''

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
        {/* <link type="text/css" rel="stylesheet" href="normalize.css" /> */}
        {props.stylesheets}
      </head>
      <body>
        {props.children}
      </body>
    </html>
  )
}