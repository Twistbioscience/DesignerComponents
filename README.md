### Designer Components


Welcome to the new designer components
To get started you will need

#### Requirements
1. node > 7 - Recommended 9.9
2. npm
3. set up nexus on your machine (only for publishing) - Ask devops or someone else from the team

#### Setting up the enviornment
1. Clone the repo
  - ssh: git@github.com:Twistbioscience/DesignerComponents.git
  - https: https://github.com/Twistbioscience/DesignerComponents.git
2. cd into DesignerComponents
3. `npm install`

#### Development
Since we are developing a library we need a dummy test env - you can find that under ./playground
To start the development env run:
`npm start` - it will run a webpack dev server - so you get all the goodies (hot reloading etc.)

#### Branching strategy
- Default branch is ```dev``` 
- PR's will be opened against dev
- Only code pushed to dev is version bumps - do not bump versions in feature branches
- Approved releases will be drafted as releases in GH and merged into production
- Squash on merge to production

#### Build and publish
We have several build outputs
- es module
- cjs 
- cjs minified
- umd

We want to be semvered so releases are manual
1. `npm version` - [version | npm Documentation](https://docs.npmjs.com/cli/version) bump the version
2. Create tag with the new version - see the docs for automatic version tag creation
3. `git commit -m "bump to version xxx"`
4. `git push && git push --tags`
5. `npm run twist-publish` - Will clean the old build, run test and checks, actually build the project and release it to nexus

#### Testing
Run `npm run test` will run jest in watch mode
For testing react components we use react-testing-library
Debugger is avaiable via standard node debugging
Debugger is exposed on port 9229 - chrome devtools are enabled by default
see explanation on debugging node apps https://nodejs.org/en/docs/guides/debugging-getting-started/


