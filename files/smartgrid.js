const smartgrid = require('smart-grid');
const config = require('./config');

// ==========
// Smart grid
// ==========
/* It's principal settings in smart grid project */
const settings = {
  outputStyle: 'scss', /* less || scss || sass || styl */
  columns: 12, /* number of grid columns */
  offset: '2rem', /* gutter width px || % || rem */
  mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
  container: {
    maxWidth: '1200px', /* max-width оn very large screen */
    fields: '2rem', /* side fields */
  },
  breakPoints: {
    lg: {
      width: '1200px - .2px', /* -> @media (max-width: 1100px) */
    },
    md: {
      width: '992px - .2px',
    },
    sm: {
      width: '768px - .2px',
      fields: '1rem',
    },
    xs: {
      width: '576px - .2px',
    },

    xxs: {
      width: '340px - .2px',
    },
    /*
    We can create any quantity of break points.

    some_name: {
        width: 'Npx',
        fields: 'N(px|%|rem)',
        offset: 'N(px|%|rem)'
    }
    */
  },
};

smartgrid(`${config.sass}/vendor`, settings);
