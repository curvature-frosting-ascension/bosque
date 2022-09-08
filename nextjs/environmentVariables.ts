const environmentVariables = [
  "AZURE_FUNCTIONS_API_KEY"
] as const

type EnvironmentVariable = typeof environmentVariables[number]

export const getEnvironmentVariable = (name: EnvironmentVariable): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} is not set.`)
  }
  return value
}