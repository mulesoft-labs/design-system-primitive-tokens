// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const _ = require('lodash');
const gulp = require('gulp');
const yaml = require('js-yaml');
const log = require('fancy-log');
const PluginError = require('plugin-error');
const yamlValidate = require('gulp-yaml-validate');
const through = require('through2');
const path = require('path');
const chalk = require('chalk');

const root = path.resolve(__dirname, '../');
const rootPath = path.resolve.bind(path, root);

const prefixes = [
  'BRAND',
  'BORDER_RADIUS',
  'BORDER_WIDTH',
  'COLOR',
  'COLOR_BACKGROUND',
  'COLOR_BORDER',
  'COLOR_TEXT',
  'DURATION',
  'ELEVATION',
  'FONT_FAMILY',
  'FONT_WEIGHT',
  'FONT_SIZE',
  'FLEX',
  'LINE_HEIGHT',
  'MAX_WIDTH',
  'MAX_HEIGHT',
  'MQ',
  'OPACITY',
  'HEIGHT',
  'SIZE',
  'SHADOW',
  'SPACING',
  'SQUARE',
  'TIMING',
  'WIDTH',
  'VAR',
  'Z_INDEX',
];

/**
 * JSON Reporter
 * Returns error stack as a JSON object
 * @param {object} lint
 */
const jsonReporter = lint => log.error(JSON.stringify(lint));

/**
 * Verbose Reporter
 * Returns error stack as a prettified string
 * @param {object} lint
 */
const verboseReporter = (results, file) =>
  results.forEach(error =>
    log.error(
      `[Lint: Tokens]: ${chalk.bgRed('FAIL')}`,
      `${error.error}: ${error.token} in ${chalk.gray(file.path)}`,
    ),
  );

/**
 * Need to check if naming convention follows
 * @param {string} tokenName
 */
const prefixLint = tokenName =>
  prefixes.some(prefix => tokenName.startsWith(prefix));

/**
 * Class that pushes linting errors to an array
 * @param {object} tokens
 * @param {object} pluginOptions
 */
const TokenLint = function(tokens, pluginOptions = {}) {
  let self = this;

  if (!(self instanceof TokenLint)) {
    return new TokenLint(tokens, pluginOptions);
  }

  self.options = _.defaults(pluginOptions || {}, {
    prefix: false,
    uppercase: true,
    characterRange: true,
  });

  self.errors = [];

  /**
   * Linting Rules
   * @param {buffer} tokenName
   */
  function _lintTokenName(tokenName) {
    let errors = [];

    if (self.options.prefix && !prefixLint(tokenName)) {
      errors.push('Token names should be prefixed appropriately');
    }
    if (self.options.uppercase && tokenName.toUpperCase() !== tokenName) {
      errors.push('Token names should be uppercase');
    }
    if (self.options.characterRange && /[^A-Z0-9_]/.test(tokenName)) {
      errors.push(
        'Token names should only contain uppercase letters, underscores and numbers',
      );
    }
    if (errors.length) {
      throw errors;
    }
  }

  /**
   * Lint tokens and push errors to object for return
   */
  Object.keys(tokens).forEach(token => {
    try {
      _lintTokenName(token);
    } catch (err) {
      err.forEach(error =>
        self.errors.push({
          token: token,
          error: error,
        }),
      );
    }
  });

  return {
    errors: self.errors,
  };
};

/**
 * Read stream and output linting errors, if any exist
 * @param {buffer} file
 * @param {object} pluginOptions
 * @param {string} reporter
 */
const tokenlintPlugin = function(file, pluginOptions = {}, reporter) {
  const tokens = yaml.safeLoad(file.contents.toString('utf8'));

  const tokenList = tokens.props
    ? tokens.props
    : tokens.aliases
    ? tokens.aliases
    : {};

  const result = TokenLint(tokenList, pluginOptions);

  if (result.errors) {
    if (result.errors.length > 0) {
      let error = new PluginError(
        `[Lint: Tokens]: `,
        `[Lint: Tokens]: Found ${result.errors.length} linting error(s) in ${
          file.path
        }`,
      );
      // throw new Error(log.error(chalk.red(`${error.message}`)));
      if (reporter === 'json') {
        jsonReporter(result.errors);
      } else if (reporter === 'verbose') {
        verboseReporter(result.errors, file);
      }
      throw new Error(
        'Opps! Something went wrong, please fix the issues notes above',
      );
    } else {
      log(
        `[Lint: Tokens]: ${chalk.bgGreen.black(
          'PASS',
        )} Found 0 linting error(s) in ${chalk.gray(file.path)} - Good Job :)`,
      );
    }
  }
  return result.errors.length;
};

/**
 * Let us lint!
 */
(() => {
  gulp
    .src(path.resolve(rootPath('design-tokens/primitive'), '*.yml'))
    .pipe(yamlValidate())
    .pipe(
      through.obj((chunk, enc, next) => {
        tokenlintPlugin(chunk, {prefix: true}, 'verbose');
        next();
      }),
    );
})();
