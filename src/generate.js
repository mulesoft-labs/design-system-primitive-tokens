// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const _ = require('lodash');
const async = require('async');
const rimraf = require('rimraf');
const gulp = require('gulp');
const gulpTheo = require('gulp-theo');
const path = require('path');

const root = path.resolve(__dirname, '../');
const rootPath = path.resolve.bind(path, root);

// Define output types
const config = {
  web: [
    'less',
    'default.scss',
    'map.scss',
    'json',
    'common.js',
    'aura.tokens',
    'custom-properties.css',
  ],
  ios: ['ios.json'],
  android: ['android.xml'],
  raw: ['raw.json'],
};

// Transform token formats into an object that Theo understands
const formatTransforms = _(config)
  .map((formats, transform) =>
    formats.map(name => ({
      name: name,
      transform: transform,
    })),
  )
  .flatten()
  .value();

// Clean files from dist then generate tokens
rimraf(rootPath('dist/*'), () => generate());

// Generate tokens to dist for distribution
const generate = done => {
  const convert = ({name, transform}, done) => {
    gulp
      .src(path.resolve(rootPath('design-tokens/primitive'), 'base.yml'))
      .pipe(
        gulpTheo({
          transform: {type: transform},
          format: {type: name},
        }),
      )
      .pipe(gulp.dest('dist'))
      .on('finish', done);
  };
  async.each(formatTransforms, convert, done);
};
