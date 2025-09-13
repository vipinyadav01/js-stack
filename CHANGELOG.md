# Changelog

All notable changes to Create JS Stack CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced template system with better error handling
- Improved CLI performance monitoring

### Changed
- Updated template resolution logic

### Fixed
- Template path resolution issues

## [1.0.8] - 2025-09-12

### Added
- **Next.js Templates**: Complete Next.js template set
  - `next.config.js.hbs` - Next.js configuration
  - `pages/index.jsx.hbs` - Homepage component with TypeScript support
  - `pages/api/hello.js.hbs` - API route example
- **Auth0 Authentication**: Full Auth0 integration templates
  - `config.js.hbs` - Auth0 configuration and environment setup
  - `routes.js.hbs` - Authentication routes (login, callback, logout, profile)
- **GitHub Actions**: CI/CD workflow template
  - `ci.yml.hbs` - Complete GitHub Actions workflow for testing and deployment
- **Template Resolver**: Enhanced template resolution system
  - Added authentication template rules
  - Improved template path resolution
  - Better fallback generation for missing templates

### Fixed
- **Template Warnings**: Resolved missing template warnings for Next.js, Prisma, and Auth0
- **Cloudflare Pages Deployment**: Fixed "Resource not accessible by integration" error
  - Removed GitHub token dependency from Cloudflare Pages action
  - Added proper workflow permissions for deployments
- **Web Dashboard URL**: Fixed typo in GitHub release section
- **Template Resolution**: Improved template file discovery and processing
- **Error Handling**: Enhanced fallback generation when templates are missing

### Changed
- **Template System**: Updated template resolver with comprehensive authentication rules
- **CI/CD Pipeline**: Enhanced GitHub Actions workflow with proper permissions
- **Build Process**: Improved CLI build performance and reliability

### Technical Improvements
- Enhanced template processing with better error recovery
- Improved memory usage during project generation
- Optimized template file scanning and resolution
- Better support for dynamic template extensions (TypeScript/JavaScript)

## [1.0.7] - 2025-09-11

### Added
- Initial release of Create JS Stack CLI
- Core CLI functionality with interactive prompts
- Basic template system for popular frameworks
- Web dashboard for project analytics
- Support for multiple frontend frameworks (React, Vue, Angular, Svelte)
- Support for multiple backend frameworks (Express, Fastify, Koa, Hapi, NestJS)
- Database support (PostgreSQL, MongoDB, MySQL, SQLite)
- ORM/ODM support (Prisma, Mongoose, Sequelize, TypeORM)
- Authentication templates (JWT, Passport, OAuth)
- Docker configuration templates
- Testing framework integration (Jest, Vitest)
- Development tools (ESLint, Prettier, Husky)
- GitHub Actions CI/CD templates

### Features
- Interactive project creation with smart defaults
- Command-line flags for non-interactive setup
- Preset configurations for common project types
- Health checks for generated projects
- Performance monitoring during project creation
- Comprehensive error handling and rollback mechanisms
- Support for TypeScript and JavaScript projects
- Multiple package manager support (npm, yarn, pnpm)

### Documentation
- Comprehensive README with usage examples
- API documentation for programmatic usage
- Template development guidelines
- Contributing guidelines and code of conduct

---

## Version History Summary

- **v1.0.8**: Template fixes and deployment improvements
- **v1.0.7**: Initial release with core functionality

## Contributing

To contribute to this changelog, please follow the [Contributing Guidelines](CONTRIBUTING.md) and update this file with your changes in the appropriate section.

## Links

- [NPM Package](https://www.npmjs.com/package/create-js-stack)
- [GitHub Repository](https://github.com/vipinyadav01/js-stack)
- [Web Dashboard](https://js-stack.pages.dev)
- [Documentation](https://github.com/vipinyadav01/js-stack#readme)
