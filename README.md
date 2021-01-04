<p align="center">
  <a href="https://morehumaninternet.org">
    <img alt="More Human Internet" src="https://raw.githubusercontent.com/morehumaninternet/roar-extension/main/img/roar_128.png" width="180" />
  </a>
</p>
<h1 align="center">
  Roar! Server
</h1>

Built with ❤️ by the team at <a href="https://morehumaninternet.org">More Human Internet</a>. See also [Roar! Extension](https://github.com/morehumaninternet/roar-extension)

## Table of Contents

- [Setup](/SETUP.md)

## Adding Pages/Styles

All files placed in the [/public](/public) directory or any of its subdirectories are served. By convention, styles go in the styles directory and scripts go in the scripts directory.

We're rendering our views using server-side React/JSX. Pages may be placed in the [/views](/views) directory, making them renderable by the [router](src/router.ts).