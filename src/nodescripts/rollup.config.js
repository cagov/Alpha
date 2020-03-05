import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import html from '@open-wc/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/js/index.js',
  output: {
    dir: 'src/js/es6/',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
    format: 'esm'
  },
  plugins: [resolve(), json(),
    html({
      inputPath: 'src/partials/js.html',
      inject: false,
      template ({ inputHtml, bundle }) {
        let outputName = '';
        Object.entries(bundle.bundle).forEach((item, obj) => {
          outputName = item[1].fileName;
        });
        return inputHtml.replace(
          '<html><head></head><!-- put js here --><body></body></html>',
          `<script type="module" src="/js/${outputName}"></script>`
        );
      }
    }),
    terser()
  ]
};

/*
can do hella replacements inside plugins like:
html({
        inputPath: './home.html',
      }),
      html({
        inputPath: './about.html',
      }),
      html({
        name: 'articles/a.html',
        inputPath: './articles/a.html',
      }),
      html({
        name: 'articles/b.html',
        inputPath: './articles/b.html',
      }),
      html({
        name: 'articles/c.html',
        inputPath: './articles/c.html',
      }),
      */
