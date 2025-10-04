.PHONY: build build-gh-pages test docs

build:
	npm run build

build-gh-pages:
	npm ci
	npm run build
	npm run docs
	npm run pages

build-and-copy:
	npm run build
	npm run docs

pages:
	npm run pages
	echo "Now copy docs/ to the gh-pages branch and push."
	echo "Suggested: git worktree add ../site gh-pages && rsync -a --delete docs/ ../site/ && cd ../site && git add . && git commit && git push"

push-gh-pages:
	git subtree push --prefix docs origin gh-pages
