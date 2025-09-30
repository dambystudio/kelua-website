import { TinaNodeBackend, LocalBackendAuthentication } from '@tinacms/datalayer'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

const handler = TinaNodeBackend({
  authentication: LocalBackendAuthentication(),
  databaseAdapter: isLocal
    ? undefined
    : {
        // In production, you would use a real database adapter
        // For now, we use the local filesystem
        store: {
          rootPath: process.env.GITHUB_WORKSPACE || process.cwd(),
          useGitContent: true,
        },
      },
})

export { handler }
