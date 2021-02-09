<a href="https://github.com/just-sultanov/setup-cljstyle/actions">
  <img alt="setup-cljstyle action status" src="https://github.com/just-sultanov/setup-cljstyle/workflows/test/badge.svg">
</a>

# setup-cljstyle

This action sets up [cljstyle](https://github.com/greglook/cljstyle) for using
in Github Actions.

## Usage

See [action.yml](action.yml)

```yaml
steps:
  - name: Install cljstyle
    uses: just-sultanov/setup-cljstyle@v1
    with:
      version: '0.14.0'

  - name: Checkout
    uses: actions/checkout@latest

  - name: Run cljstyle
    run: cljstyle check src
```

## License

The scripts and documentation in this project are released under
the [MIT License](LICENSE).
