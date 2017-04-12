#!/usr/bin/env bash

GITLAB_URL="https://smcwebfonts-bot:${GITLAB_REPO_TOKEN}@gitlab.com/kollavarsham/smc-webfonts.git"
GITHUB_URL="https://${GITHUB_REPO_TOKEN}@github.com/kollavarsham/smc-webfonts.git"

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Add remote and push into the GitLab repo
git remote remove gitlab > /dev/null 2>&1
git remote add gitlab ${GITLAB_URL} > /dev/null 2>&1
git checkout master
git merge "v${PACKAGE_VERSION}" -m "Merge tag 'v${PACKAGE_VERSION}' [ci skip]"
git push --follow-tags gitlab master > /dev/null 2>&1

# Add remote merge and push to the GitHub repo
cd .github/
git remote remove github > /dev/null 2>&1
git remote add github ${GITHUB_URL} > /dev/null 2>&1
git checkout master
git push --follow-tags github master > /dev/null 2>&1
git checkout gh-pages
git merge master > /dev/null 2>&1
git push github gh-pages > /dev/null 2>&1