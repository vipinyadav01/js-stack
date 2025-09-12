# Contributing to Create JS Stack CLI

Thank you for your interest in contributing to Create JS Stack CLI! 🎉

This document provides guidelines and instructions for contributing to this project. We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Adding New Templates](#adding-new-templates)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: Latest version
- **VS Code** (recommended) or your preferred editor

### Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/vipinyadav01/create-js-stack-cli.git
   cd create-js-stack-cli
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the CLI**:
   ```bash
   npm run build:cli
   ```

## 🛠️ Development Setup

### Local Development

1. **Create a development branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally:
   ```bash
   # Test the CLI locally
   node dist/cli.js init test-project --help
   
   # Run linting
   npm run lint
   
   # Run tests
   npm run test
   ```

3. **Rebuild after changes**:
   ```bash
   npm run build:cli
   ```

### Development Scripts

```bash
# Build the CLI
npm run build:cli

# Run development server for web dashboard
npm run dev:web

# Run linting
npm run lint
npm run lint:fix

# Run tests
npm run test

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## 📁 Project Structure

```
create-js-stack-cli/
├── src/                    # Source code
│   ├── cli.js             # Main CLI entry point
│   ├── commands/          # CLI commands
│   ├── generators/        # Project generators
│   ├── utils/             # Utility functions
│   └── types.js           # Type definitions
├── templates/             # Project templates
│   ├── frontend/          # Frontend frameworks
│   ├── backend/           # Backend frameworks
│   ├── database/          # Database configurations
│   ├── auth/              # Authentication templates
│   ├── docker/            # Docker configurations
│   ├── testing/           # Testing frameworks
│   └── config/            # Configuration files
├── web/                   # Web dashboard (Next.js)
├── dist/                  # Built CLI files
└── scripts/               # Build and deployment scripts
```

## 🎯 How to Contribute

### Types of Contributions

We welcome several types of contributions:

1. **🐛 Bug Fixes**: Fix existing issues
2. **✨ New Features**: Add new functionality
3. **📚 Documentation**: Improve docs and examples
4. **🎨 Templates**: Add new framework templates
5. **🧪 Tests**: Add or improve test coverage
6. **🔧 Tooling**: Improve development tools
7. **🌐 Translations**: Add language support

### Before You Start

1. **Check existing issues** to see if someone is already working on it
2. **Create an issue** for significant changes to discuss the approach
3. **Keep changes focused** - one feature/fix per pull request

### Contribution Workflow

1. **Fork and clone** the repository
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit a pull request**

## 🎨 Adding New Templates

### Template Structure

Templates use [Handlebars](https://handlebarsjs.com/) for dynamic content:

```handlebars
// Example: templates/frontend/react/package.json.hbs
{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    {{#if typescript}}
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@types/react": "^18.0.0"
    {{else}}
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
    {{/if}}
  }
}
```

### Template Context Variables

Available variables in templates:

```javascript
{
  projectName: "my-app",
  typescript: true,
  useTypeScript: true,
  frontend: ["react"],
  backend: "express",
  database: "postgres",
  orm: "prisma",
  auth: "jwt",
  packageManager: "npm",
  hasDocker: true,
  hasTesting: true,
  // ... more variables
}
```

### Adding a New Framework Template

1. **Create template directory**:
   ```bash
   mkdir -p templates/frontend/your-framework
   ```

2. **Add template files**:
   - `package.json.hbs` - Package configuration
   - `src/App.jsx.hbs` - Main component
   - `src/main.jsx.hbs` - Entry point
   - `index.html.hbs` - HTML template
   - Any other framework-specific files

3. **Update template resolver** in `src/utils/template-resolver.js`:
   ```javascript
   [FRONTEND_OPTIONS.YOUR_FRAMEWORK]: {
     base: "your-framework",
     files: ["package.json", "src/App.jsx", "src/main.jsx"],
     dependencies: ["your-framework", "build-tool"]
   }
   ```

4. **Add framework option** in `src/types.js`:
   ```javascript
   export const FRONTEND_OPTIONS = {
     // ... existing options
     YOUR_FRAMEWORK: "your-framework"
   };
   ```

5. **Update prompts** in `src/prompts-modern.js` or `src/prompts-enhanced.js`

### Template Best Practices

- **Use conditional logic** for TypeScript/JavaScript variations
- **Include all necessary files** for a working project
- **Follow framework conventions** and best practices
- **Add helpful comments** in generated code
- **Test templates** by generating projects

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Templates

1. **Generate a test project**:
   ```bash
   node dist/cli.js init test-project --frontend your-framework --yes
   ```

2. **Verify the generated project**:
   - Check file structure
   - Verify package.json dependencies
   - Test that the project builds and runs

3. **Clean up test projects**:
   ```bash
   rm -rf test-project
   ```

### Test Coverage

We aim for good test coverage. When adding new features:

1. **Add unit tests** for utility functions
2. **Add integration tests** for CLI commands
3. **Test template generation** with various configurations
4. **Verify error handling** and edge cases

## 📝 Submitting Changes

### Pull Request Guidelines

1. **Clear title** describing the change
2. **Detailed description** of what was changed and why
3. **Reference issues** using `Fixes #123` or `Closes #123`
4. **Add screenshots** for UI changes
5. **Update documentation** if needed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or marked as such)
```

### Code Review Process

1. **Automated checks** must pass (linting, tests)
2. **Manual review** by maintainers
3. **Address feedback** promptly
4. **Squash commits** before merging

## 🚀 Release Process

### Version Bumping

We use [semantic versioning](https://semver.org/):

- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

### Release Steps

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with changes
3. **Create release notes**
4. **Tag the release**: `git tag v1.0.1`
5. **Publish to npm**: `npm publish`
6. **Create GitHub release**

## 💬 Community Guidelines

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Discord**: [Join our community](https://discord.gg/your-discord)

### Code Style

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled automatically
- **Conventional Commits**: Use conventional commit messages
- **Comments**: Add comments for complex logic

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```
feat(templates): add Vue 3 template support
fix(cli): resolve template path resolution issue
docs(readme): update installation instructions
```

## 🏆 Recognition

Contributors are recognized in:

- **README.md** contributor section
- **Release notes** for significant contributions
- **GitHub contributor graphs**
- **Community highlights**

## 📞 Contact

- **Maintainer**: [@vipinyadav01](https://github.com/vipinyadav01)
- **Email**: [your-email@example.com]
- **Twitter**: [@your-twitter]

## 🙏 Thank You

Thank you for contributing to Create JS Stack CLI! Your contributions help make JavaScript development more accessible and efficient for developers worldwide.

---

**Happy Coding!** 🎉
