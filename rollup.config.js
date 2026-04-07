import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

const external = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'vue',
  '@angular/core',
  '@angular/common',
];

/** @param {boolean} [declarations] */
const tsPlugin = () =>
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    declarationDir: undefined,
  });

/** @type {import('rollup').RollupOptions[]} */
export default [
  // ── Core — ESM (for bundlers / import)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/viewer-360.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [resolve(), tsPlugin()],
  },

  // ── Core — UMD (for CDN / <script> tag)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/viewer-360.umd.cjs',
      format: 'umd',
      name: 'Viewer360',
      sourcemap: true,
    },
    plugins: [resolve(), tsPlugin()],
  },

  // ── React wrapper
  {
    input: 'src/react/index.tsx',
    external,
    output: {
      file: 'dist/react/index.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [resolve(), tsPlugin()],
  },

  // ── Vue 3 wrapper
  {
    input: 'src/vue/index.ts',
    external,
    output: {
      file: 'dist/vue/index.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [resolve(), tsPlugin()],
  },
];
