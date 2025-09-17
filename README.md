# Repository and Configuration Instructions

## Repository
**Konoha-Medical-Corps**: Public GitHub repository that centralizes the source code, documentation, and CI/CD workflows with GitHub Actions.  
- **Description:** Contains the entire system code, documentation files, and automated pipelines for testing and deployment.  
- **Usage:**  
  - Centralized management of project code.  
  - Collaboration between development teams.  
  - Tracking of issues, pull requests, and version control.  
  - URL: [Konoha-Medical-Corps](https://github.com/sara446/Konoha-Medical-Corps)  

## Configuration Instructions

**Step 1. Clone the repository**  
```bash
git clone https://github.com/sara446/Konoha-Medical-Corps.git
cd Konoha-Medical-Corps
```
- **Description:** Downloads the project repository locally and enters the folder.
- **Usage:**  
  - Access to project files.  
  - Ability to make changes and execute locally.  

**Step 2. Install dependencies**  
```bash
npm install
```
- **Description:** Installs all Node.js dependencies required for the project.
- **Usage:**  
  - Prepare the environment to run the application.  

**Step 3. Configure the MongoDB database**  
```env
MONGO_URI=mongodb://localhost:27017/konoha_medical
```
- **Description:** The project uses MongoDB as a database manager; an .env file is required with the connection string.
- **Usage:**  
  - Define the connection string to the local or cloud database.  
  - Ensure that the application can persist and query data.  

**Step 4. Run the application**  
```bash
npm start
```
- **Description:** Launches the project in development mode.
- **Usage:**  
  - Test the system locally before deploying it.  

**Step 5. Automated tests**  
```bash
npm test
```
- **Description:** Runs the defined tests in the project. Configured in CI/CD to run on every push or pull request.
- **Usage:**  
  - Validate that the code works correctly.  
  - Guarantee integration and deployment stability.  

## Project Branch Structure

### Main Branches
**main**: Stable branch ready for production.  
- **Description:** This is the stable and production-ready branch. It contains code that has been tested and validated.  
- **Usage:**  
  - Deployment of stable releases.  
  - Integration of changes that have gone through reviews and testing.  

**dev**: Development branch for integrating new features.  
- **Description:** This branch is used to integrate new features and changes. It is where testing is done before merging into the main branch.  
- **Usage:**  
  - Development of new functionalities.  
  - Integration testing of different features.  
  - Preparation of the next stable release.  

### Feature Branches
**feature/feature-name**: Branches for developing new features.  
- **Description:** These branches are created to develop specific new features. Each feature should have its own branch.  
- **Usage:**  
  - Develop and test new functionalities in isolation.  
  - Facilitate specific code reviews for each feature.  

### Bugfix Branches
**bugfix/bug-name**: Branches for fixing bugs.  
- **Description:** These are used to fix bugs found in the development branch or the main branch.  
- **Usage:**  
  - Address critical issues detected in production or during testing.  
  - Apply fixes quickly and merge back to dev and main as required.  

### Release Branches
**release/version-name**: Branches for preparing new releases.  
- **Description:** These branches are created to prepare a new version for production. They are used for final testing, polishing, and minor fixes.  
- **Usage:**  
  - Stabilization of the code before merging into the main branch.  
  - Preparation of release notes and final QA.
