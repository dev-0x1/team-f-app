const handlePullRequestChange = require('../lib/handle-pull-request-change')
const nock = require('nock')
const github = require('@octokit/rest')()

// prevent all network activity to ensure mocks are used
nock.disableNetConnect()

describe('handlePullRequestChange', () => {
  test('it is a function', () => {
    expect(typeof handlePullRequestChange).toBe('function')
  })

  test('sets `pending` status if PR is invalid', async () => {
    const context = buildContext()
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/anuragmaher',
      description: 'check',
      context: 'Pull Request Tests'
    }

    const mock = nock('https://api.github.com')
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(false)
  })
})

function buildContext (overrides) {
  const defaults = {
    log: () => { /* no-op */ },

    // an instantiated GitHub client like the one probot provides
    github: github,

    // context.repo() is a probot convenience function
    repo: (obj = {}) => {
      return Object.assign({ owner: 'sally', repo: 'project-x' }, obj)
    },

    payload: {
      pull_request: {
        number: 123,
        title: 'do a thing',
        body: 'do a thing',
        head: {
          sha: 'abcdefg'
        }
      }
    }
  }

  return Object.assign({}, defaults, overrides)
}

function unsemanticCommits () {
  return [
    { commit: { message: 'fix something' } },
    { commit: { message: 'fix something else' } }
  ]
}
