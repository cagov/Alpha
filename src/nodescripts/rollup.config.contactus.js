import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import html from '@open-wc/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/js/contactus/index.js',
  output: {
    dir: 'src/js/es6/',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
    format: 'esm'
  },
  plugins: [resolve(), json(),
    html({
      inputPath: 'src/partials/jscontactus.html',
      inject: false,
      template ({ inputHtml, bundle }) {
        let outputName = '';
        Object.entries(bundle.bundle).forEach(item => {
          outputName = item[1].fileName;
        });
        return inputHtml.replace(
          '<html><head></head><!-- put zips js here --><body></body></html>',
          `<script type="module" src="/js/${outputName}"></script>`
        );
      }
    }),
    terser()
  ]
};
