# Salesforce Lightning Design System Primitive Tokens

Welcome to the [Salesforce Lightning Design System](https://www.lightningdesignsystem.com) Primitive Tokens brought to you by [Salesforce UX](https://twitter.com/salesforceux).

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
