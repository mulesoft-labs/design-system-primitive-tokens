// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

/* eslint-env jest */
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const ROOT = path.resolve(__dirname, '../../');
const BASE = path.resolve(ROOT, 'design-tokens');
const DIST = path.resolve(ROOT, 'dist');

const formats = [
  'android.xml',
  'aura.tokens',
  'common.js',
  'custom-properties.css',
  'default.scss',
  'ios.json',
  'json',
  'less',
  'map.scss',
  'raw.json',
];

const globalAccess = [
  'colorBackground',
  'colorBackgroundAlt',
  'colorBackgroundAltInverse',
  'colorBackgroundRowHover',
  'colorBackgroundRowActive',
  'colorBackgroundRowSelected',
  'colorBackgroundRowNew',
  'colorBackgroundInverse',
  'colorBackgroundHighlight',
  'colorBackgroundStencil',
  'colorBackgroundStencilAlt',
  'colorBrand',
  'colorBrandDark',
  'colorTextBrand',
  'colorTextIconDefault',
  'colorTextLabel',
  'colorTextPlaceholder',
  'colorTextPlaceholderInverse',
  'colorTextRequired',
  'colorTextActionLabel',
  'colorTextActionLabelActive',
  'colorTextDefault',
  'colorTextError',
  'colorTextInverse',
  'colorTextInverseWeak',
  'colorTextLink',
  'colorTextLinkActive',
  'colorTextLinkDisabled',
  'colorTextLinkFocus',
  'colorTextLinkHover',
  'colorTextLinkInverse',
  'colorTextLinkInverseHover',
  'colorTextLinkInverseActive',
  'colorTextLinkInverseDisabled',
  'colorTextWeak',
  'colorBorder',
  'colorBorderBrand',
  'colorBorderError',
  'colorBorderSuccess',
  'colorBorderWarning',
  'colorBorderSeparator',
  'colorBorderSeparatorAlt',
  'colorBorderSeparatorAlt',
  'colorBorderSeparatorInverse',
  'colorBorderRowSelected',
  'colorBorderRowSelectedHover',
  'fontFamily',
  'fontWeightLight',
  'fontWeightRegular',
  'fontWeightBold',
  'lineHeightHeading',
  'lineHeightText',
  'lineHeightReset',
  'lineHeightTab',
  'borderWidthThin',
  'borderWidthThick',
  'spacingXxxSmall',
  'spacingXxSmall',
  'spacingXSmall',
  'spacingSmall',
  'spacingMedium',
  'spacingLarge',
  'spacingXLarge',
  'spacingXxLarge',
  'varSpacingXxxSmall',
  'varSpacingXxSmall',
  'varSpacingXSmall',
  'varSpacingSmall',
  'varSpacingMedium',
  'varSpacingLarge',
  'varSpacingXLarge',
  'varSpacingXxLarge',
  'varSpacingHorizontalXxxSmall',
  'varSpacingHorizontalXxSmall',
  'varSpacingHorizontalXSmall',
  'varSpacingHorizontalSmall',
  'varSpacingHorizontalMedium',
  'varSpacingHorizontalLarge',
  'varSpacingHorizontalXLarge',
  'varSpacingHorizontalXxLarge',
  'varSpacingVerticalXxxSmall',
  'varSpacingVerticalXxSmall',
  'varSpacingVerticalXSmall',
  'varSpacingVerticalSmall',
  'varSpacingVerticalMedium',
  'varSpacingVerticalLarge',
  'varSpacingVerticalXLarge',
  'varSpacingVerticalXxLarge',
  'borderRadiusSmall',
  'borderRadiusMedium',
  'borderRadiusLarge',
  'borderRadiusPill',
  'borderRadiusCircle',
  'sizeXxSmall',
  'sizeXSmall',
  'sizeSmall',
  'sizeMedium',
  'sizeLarge',
  'sizeXLarge',
  'sizeXxLarge',
  'squareIconUtilitySmall',
  'squareIconUtilityMedium',
  'squareIconUtilityLarge',
  'squareIconLargeBoundary',
  'squareIconLargeBoundaryAlt',
  'squareIconLargeContent',
  'squareIconMediumBoundary',
  'squareIconMediumBoundaryAlt',
  'squareIconMediumContent',
  'squareIconSmallBoundary',
  'squareIconSmallContent',
  'squareIconXSmallBoundary',
  'squareIconXSmallContent',
  'shadowDrag',
  'shadowDropDown',
  'shadowHeader',
  'durationInstantly',
  'durationImmediately',
  'durationQuickly',
  'durationPromptly',
  'durationSlowly',
  'durationPaused',
];

function summarizeFilesInDirSync(directory) {
  return fs.readdirSync(directory);
}

function summarizeContentInFileSync(file) {
  return fs.readFileSync(file);
}

function getRawFile(file) {
  return summarizeContentInFileSync(path.resolve(ROOT, file)).toString();
}

describe('primitive tokens', () => {
  // Check that expected file formats are being generated
  it('check if all platform tokens are being properly compiled', () => {
    const dir = summarizeFilesInDirSync(DIST);
    dir.map(key => {
      const format = key.replace(/(base.)/, '');
      expect(formats).toContain(format);
    });
  });

  // Check that primitive token files exist
  it('check that token files are found', () => {
    const dir = summarizeFilesInDirSync(path.resolve(BASE, 'primitive'));
    expect(dir).toMatchSnapshot();
  });

  // Check that primitive alias files exist
  it('check that alias files are found', () => {
    const dir = summarizeFilesInDirSync(path.resolve(BASE, 'aliases'));
    expect(dir).toMatchSnapshot();
  });

  // Check metadata so we don't cause platform regressions
  it('check that metadata for global access matches whats exposed on platform', () => {
    const rawFile = JSON.parse(getRawFile(`dist/base.raw.json`));
    let primitiveArray = [];
    Object.keys(rawFile.props).map(key => {
      const prop = rawFile.props[key];
      if (prop.access === 'global') {
        primitiveArray.push(_.camelCase(prop.name));
      }
    });
    globalAccess.map(key => {
      expect(primitiveArray).toContain(key);
    });
  });
});
