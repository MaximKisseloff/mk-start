const basePath = {
  src: 'resources/assets',
  build: 'public',
};

const config = {
  env: 'development',

  setEnv(env) {
    if (typeof env !== 'string') return;

    if (env === 'production') {
      this.env = 'production';
    }
  },

  basePathSrc: basePath.src,
  basePathBuild: basePath.build,

  // Html
  html: basePath.build,

  // Sass and css
  sass: `${basePath.src}/sass`,
  css: `${basePath.build}/css`,

  // Nunjucks
  njk: `${basePath.src}/njk`,
  nunjucksPages: `${basePath.src}/njk/pages`,
  nunjucksTemplate: `${basePath.src}/njk/templates`,

  // JavaScript
  js: `${basePath.build}/js`,
  jsModules: `${basePath.src}/js`,
  jsMainFile: 'base.js',

  // Image
  img: `${basePath.src}/img`,
  svg: `${basePath.src}/img/svg`,
  favicon: `${basePath.src}/img/favicon`,
  imgBuild: `${basePath.build}/img`,
  svgBuild: `${basePath.build}/img/svg`,
  faviconBuild: `${basePath.build}/img/favicon`,

  // Fonts
  fonts: `${basePath.src}/fonts`,
};

module.exports = config;
