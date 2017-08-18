# @comandeer/milestone-webhook

[![Build Status](https://travis-ci.org/Comandeer/milestone-webhook.svg?branch=master)](https://travis-ci.org/Comandeer/milestone-webhook) [![Dependency Status](https://david-dm.org/Comandeer/milestone-webhook.svg)](https://david-dm.org/Comandeer/milestone-webhook) [![devDependencies Status](https://david-dm.org/Comandeer/milestone-webhook/dev-status.svg)](https://david-dm.org/Comandeer/milestone-webhook?type=dev)

Check if pull request is targeted into correct branch.

## How does it work?

This hook uses exclusively conventions from CKEditor 4 workflow:

* There are 2 main branches: `master` and `major`.
* All minor releases (x.y.z) are based on `master` branch.
* All major releases (x.y.0) are based on `major` branch.
* All PR-s are created from `t/x` branch, where `x` refers to the issue number.
* Every issue could have one of four allowed milestone values:
	* `4.x.y` – next minor release; merged to `master`
	* `4.x.0` – next major release; merged to `major`
	* `Backlog` – done when it's done; merged to `master`
	* no milestone – done when it's done although it probably shouldn't be done; merged to `master`
* Based on the milestone of PR's parent issue, PR should be merged into appropriate branch (`master` or `major`).

Based on this conventions, it finds the PR's parent issue (via branch's name or [PR's descrition](https://help.github.com/articles/closing-issues-using-keywords/)) and determine appropriate branch using its milestone.

It needs 4 environment variables:

* `GH_MSWH_SECRET` – hook's secret
* `GH_MSWH_TOKEN` – personal token from repo's owner/administrator with at least `repo:status` scope
* `GH_MSWH_OWNER` – repo's owner
* `GH_MSWH_REPO` – repo's name

## License

See [LICENSE](./LICENSE) file for details.
