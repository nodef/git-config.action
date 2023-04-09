A GitHub Action for configuring git.

```yaml
# Configure credentials for GitHub and GitHub Gist.
- uses: nodef/git-config.action@v0.6.0
  with:
    credentials: |-
      github.com=${{secrets.GITHUB_TOKEN}}
      gist.github.com=${{secrets.GITHUB_TOKEN}}


# Automatically configure credentials using environment variables.
# Needs $GH_TOKEN/$GITHUB_TOKEN to be set.
- uses: nodef/git-config.action@v0.6.0


# Automatically configure credentials, and set user name and email.
- uses: nodef/git-config.action@v0.6.0
  with:
    credentials: auto
    entries: |-
      user.name  = Your Name
      user.email = your-email@example.com


# Automatically configure credentials, user name, and email.
# Needs the following to be set:
# - $GH_TOKEN / $GITHUB_TOKEN
# - $GIT_AUTHOR_NAME  / $GIT_COMMITTER_NAME
# - $GIT_AUTHOR_EMAIL / $GIT_COMMITTER_EMAIL / $EMAIL
- uses: nodef/git-config.action@v0.6.0
```

<br>


#### Options

```yaml
- uses: nodef/git-config.action@v0.6.0
  with:
    path: $HOME/.gitconfig  # Path to the .gitconfig file
    credentials-path: $HOME/.git-credentials  # Path to the .git-credentials file
    reset: false            # Reset the .gitconfig, .git-credentials files
    credentials: |-         # Credentials to configure
      myhost1=authtoken1
      mhhost2=authtoken2
      ...
    entries: |-             # Entries to add
      key1=value1
      key2=value2
      ...
```

<br>
<br>


## References

- [kota65535/github-git-config-action : Tomohiko Ozawa](https://github.com/kota65535/github-git-config-action)
- [dawidd6/action-git-user-config : Dawid Dziurla](https://github.com/dawidd6/action-git-user-config)
- [google-github-actions/get-secretmanager-secrets](https://github.com/google-github-actions/get-secretmanager-secrets)
- [Creating a JavaScript Action - GitHub Docs](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
- [Metadata syntax for GitHub Actions - GitHub Docs](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)
- [Git Internals - Environment Variables](https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables)
- [Git Tools - Credential Storage](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)
- [git-config - Git Documentation](https://git-scm.com/docs/git-config)
- [Storing Git Credentials with Git Credential Helper : Seralahthan](https://techexpertise.medium.com/storing-git-credentials-with-git-credential-helper-33d22a6b5ce7)
- [How to Save Username and Password in Git : Maria Naz](https://linuxhint.com/save-username-password-in-git/)
- [Error: Cannot find module '@actions/core'](https://github.com/Azure/docker-login/issues/3)
- [How Do I Use GIT_CONFIG Environment Variable](https://stackoverflow.com/a/67714373/1413259)
- [Git: Easiest way to reset git config file](https://stackoverflow.com/q/35853986/1413259)
- [How can I save username and password in Git?](https://stackoverflow.com/a/35942890/1413259)
- [How to use array input for a custom GitHub Actions](https://stackoverflow.com/a/75420778/1413259)
