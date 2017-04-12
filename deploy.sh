#!/usr/bin/env bash

GITLAB_URL="https://floydpink:${GITLAB_REPO_TOKEN}@gitlab.com/kollavarsham/smc-webfonts.git"
GITHUB_URL="https://${GITHUB_REPO_TOKEN}@github.com/kollavarsham/smc-webfonts.git"

# Add remote and push into the GitLab repo
git remote remove gitlab 2>/dev/null
git remote add gitlab ${GITLAB_URL}
git push --follow-tags gitlab master

# Add remote merge and push to the GitHub repo
cd .github/
git remote remove github 2>/dev/null
git remote add github ${GITHUB_URL}
git push --follow-tags github master
git checkout gh-pages
git merge master
git push github gh-pages