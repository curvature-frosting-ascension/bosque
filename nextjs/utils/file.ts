export const getFileExtension = (fileName: string) => {
  const split = fileName.split(".").map(e => e.toLowerCase())
  return split.at(-1) ?? ""
}

export const isParsableFileType = (fileExtension: string): boolean => {
  return fileExtension === "pdf"
}