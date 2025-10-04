#!/usr/bin/env bash
set -euo pipefail

# Configuration
MAIN_BRANCH="main"
PAGES_BRANCH="gh-pages"
WORKTREE_DIR=".gh-pages-worktree"
BUILD_DIR="docs"

if ! git rev-parse --verify "$MAIN_BRANCH" >/dev/null 2>&1; then
  echo "Main branch '$MAIN_BRANCH' not found" >&2
  exit 1
fi

if ! git rev-parse --verify "$PAGES_BRANCH" >/dev/null 2>&1; then
  echo "Pages branch '$PAGES_BRANCH' not found. Creating..."
  git branch "$PAGES_BRANCH" "$MAIN_BRANCH"
fi

# Ensure fresh build from main
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "$MAIN_BRANCH" ]; then
  echo "Checkout $MAIN_BRANCH and run build commands first." >&2
  exit 1
fi

npm run build-gh-pages

# Prepare worktree
if [ -d "$WORKTREE_DIR" ]; then
  rm -rf "$WORKTREE_DIR"
fi

git worktree add "$WORKTREE_DIR" "$PAGES_BRANCH"

rsync -av --delete --exclude '.git' "$BUILD_DIR"/ "$WORKTREE_DIR"/

cd "$WORKTREE_DIR"

git add .
if git diff --cached --quiet; then
  echo "No changes to deploy."
else
  git commit -m "Deploy site"
  git push origin "$PAGES_BRANCH"
fi

cd ..
git worktree remove "$WORKTREE_DIR"
