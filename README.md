# Project Branch Structure

## Main Branches
**main**: Stable branch ready for production.
- **Description:** This is the stable and production-ready branch. It contains code that has been tested and validated.
**Usage:**
- Deployment of stable releases.
- Integration of changes that have gone through reviews and testing.

**dev**: Development branch for integrating new features.
- **Description:** This branch is used to integrate new features and changes. It is where testing is done before merging into the main branch.
**Usage:**
- Development of new functionalities.
- Integration testing of different features.
- Preparation of the next stable release.

## Feature Branches
- **feature/feature-name**: Branches for developing new features.
- **Description:** These branches are created to develop specific new features. Each feature should have its own branch.
**Usage:**
- Develop and test new functionalities in isolation.
- Facilitate specific code reviews for each feature.

## Bugfix Branches
- **bugfix/bug-name**: Branches for fixing bugs.
- **Description:** These are used to fix bugs in the development branch or the main branch.
**Usage:**
- Address critical issues detected in production or the testing phase.

## Release Branches
- **release/version-name**: Branches for preparing new releases.
- **Description:** These branches are created to prepare a new version for production. They are used for final testing and corrections.
**Usage:**
- Stabilization of the code before merging into the main branch.
- Documentation and preparation of release notes.
