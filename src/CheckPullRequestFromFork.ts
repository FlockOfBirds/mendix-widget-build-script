// On the travis server the secured environment variable are not available when pull requests from a fork.
// Hence some tests cannot be performed.
// Encrypted environment variables have been removed for security reasons.
// See https://docs.travis-ci.com/user/pull-requests/#Pull-Requests-and-Security-Restrictions

if (process.env.TRAVIS_PULL_REQUEST) {
    // Slug  is in the form owner_name/repo_name
    const sourceSlug = process.env.TRAVIS_PULL_REQUEST_SLUG;
    const destinationSlug = process.env.TRAVIS_REPO_SLUG;
    if (sourceSlug && destinationSlug
        && sourceSlug.split("/")[0] !== destinationSlug.split("/")[0]) {
        process.exit(0);
    }
}
process.exit(1);
