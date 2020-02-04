# Salesforce Lightning Design System Primitive Tokens

Welcome to the [Salesforce Lightning Design System](https://www.lightningdesignsystem.com) Primitive Tokens brought to you by [Salesforce UX](https://twitter.com/salesforceux).

[![Build Status](https://travis-ci.com/salesforce-ux/design-system-primitive-tokens.svg?token=25JxdcC3MfQrezbAmHvW&branch=master)](https://travis-ci.com/salesforce-ux/design-system-primitive-tokens) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=salesforce-ux/design-system-primitive-tokens&identifier=180633818)](https://dependabot.com)

* Primitive tokens are an abstraction of Salesforce's UI into name and value design properties.

## Quick start

1. Clone the project with `git clone https://github.com/salesforce-ux/design-system-primitive-tokens.git`
2. Run `npm install` in the root design-system-primitive-tokens folder.

## Build Tokens

### Generate Tokens

`npm run build`

### Lint Tokens

`npm run lint`

### Tests

`npm run test`

## Add new aliases

Within the `design-tokens` folder you will find an `aliases` folder. This is where re-usable aliases will reside. Aliases can be imported into any token YAML file and referenced as a value with `{!ALIAS_NAME}` syntax. **Note** Aliases cannot be consumed outside of a tokens YAML file.

### Importing aliases

```yaml
imports:
- ../aliases/colors.yml
```

### Using an alias

```yaml
props:
  COLOR_BACKGROUND:
    value: '{!PALETTE_GRAY_2}'
```

## Adding a new token

Within the `design-tokens` folder you will find a `primitive` folder. This is where consumable named tokens reside. They can either reference an alias as its value or a string value.

```yaml
## primitive/background-color.yml
global:
  type: color
  category: background-color
  cssProperties:
  - 'background*'
  - 'border*'
  - box-shadow
imports:
- ../aliases/colors.yml
props:
  COLOR_BACKGROUND:
    value: '{!PALETTE_GRAY_2}'
    comment: Default background color for the whole app.
```

## Naming your token

The naming convention for a primitive token is:

`CATEGORY_PROPERTY_ATTRIBUTE_RELATIONSHIP_STATE`

- **Category** — [required] Indicates the category of the token.  
- **Property** — [optional] Semantic UI property being described. By negating a property declaration, token is valid as a generic UI property.
- **Attribute** — [optional] Semantic characteristic of a property.
- **Relationship** — [optional] If necessary, a relational name that is relative to other tokens of similar types. E.g. primary vs secondary
- **State** — [optional] If necessary, the state of a token when used in the context of interaction design. E.g. hover, focus, selected

**Usage combinations**

```yaml
## Category + Property
COLOR_BACKGROUND
## Category + Property + Attribute 
SIZING_WIDTH_SMALL
## Category + Property + State 
COLOR_BACKGROUND_SELECTED
## Category + Property + Theme
COLOR_BACKGROUND_INVERSE
## Category + Property + Attribute + State
COLOR_BORDER_DESTRUCTIVE_HOVER
## Category + Property + Attribute + Relationship 
COLOR_TEXT_LINK_WEAK_SECONDARY
## Category + Property + Attribute + Relationship + State 
COLOR_TEXT_LINK_WEAK_SECONDAY_HOVER
```

**Categories**

|Categories => Properties|Token Prefix|Usage Description|
|-|-|-|
|Color|COLOR|Generic UI color|
|└── Brand|COLOR_BRAND|Brand color associated to theming algorithm|
|└── Background|COLOR_BACKGROUND|Generic UI background colors|
|└── Border|COLOR_BORDER|Generic UI border colors|
|└── Gradient|COLOR_GRADIENT|Generic UI gradient colors|
|└── Text|COLOR_TEXT|Generic UI text colors|
|└── Text Link|COLOR_TEXT_LINK|Generic UI text link colors|
|Font|FONT|Salesforce font family declarations|
|└── Style|FONT_STYLE|Supported font family styles|
|└── Size|FONT_SIZE|Generic typographic scale for fonts|
|└── Weight|FONT_WEIGHT|Supported font family weights|
|Opacity|OPACITY|Generic opacity levels|
|Line-height|LINE-HEIGHT|Relative line-height declarations|
|Spacing|SPACING|Box-model spacing declarations, padding and margin|
|Radius|RADIUS|Generic UI radius values|
|Sizing|SIZING|Generic UI sizing, can be used on box-model|
|└── Border|SIZING_BORDER|Generic UI border widths|
|└── Square|SIZING_SQUARE|Generic UI dimensions to output a 1:1 square|
|└── Width|SIZING_WIDTH|Generic UI widths|
|Shadow|SHADOW|Generic shadows used for depth|
|Duration|DURATION|Generic timing durations for animations|
|Touch|TOUCH|Touch specific values|
|Media Query|MQ|Supported media queries|
|Depth|DEPTH|Z-index declarations for stacking context|
|Variable|VAR|Dynamic values that change based on user prefs|
|└── Spacing|VAR_SPACING|Dynamic box-model spacing declarations|
|└── Font-size|VAR_FONT_SIZE|Dynamic font-size declarations|


### Adding a new category

If you need to add a new token category that does not currently exist, create a YAML file associated with the category you'd like to have a reference to.

```
primitive/
└── new_category.yml
```

Once the file is created, you will need to import its reference into `base.yml` inside of the `primitive` folder. After the file and its content have been created, it would be a good idea to run `npm run test -- -u` to update tests to reflect your additions.

```yaml
## primitive/base.yml
imports:
- ./new_category.yml
```

## Licenses

* Source code is licensed under [BSD 3-Clause](https://git.io/sfdc-license)
