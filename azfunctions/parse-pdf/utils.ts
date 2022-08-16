type ValidationResult<T> = {
  validated: T,
  status: "validated"
} | {
  error: string,
  status: "error"
}

export const validatePageQuery = (pageQuery: string | undefined): ValidationResult<number> => {
  if (!pageQuery) {
    return {
      error: "page must be provided.",
      status: "error"
    }
  }
  if (pageQuery.split(",").length > 1) {
    return {
      error: "page cannot be provided multiple times.",
      status: "error"
    }
  }

  const page = parseInt(pageQuery, 10)
  if (!Number.isFinite(page)) {
    return {
      error: "page must be a valid number",
      status: "error"
    }
  }

  return {
    validated: page,
    status: "validated"
  }
}

export const validateFormatQuery = (formatQuery: string | undefined, acceptedFormats: string[]): ValidationResult<string> => {
  if (!formatQuery) {
    return {
      error: "format must be provided.",
      status: "error"
    }
  }
  const found = acceptedFormats.find(format => format === formatQuery)
  if (!found) {
    return {
      error: `format must be one of: ${acceptedFormats.join(", ")}.`,
      status: "error"
    }
  }
  return {
    validated: formatQuery,
    status: "validated",
  }
}

export const validateParserQuery = (parserQuery: string | undefined, acceptedParsers: string[]): ValidationResult<typeof acceptedParsers[number]> => {
  if (!parserQuery) {
    return {
      error: "parser must be provided.",
      status: "error",
    }
  }
  const found = acceptedParsers.find(parser => parser === parserQuery)
  if (!found) {
    return {
      error: `parser must be one of: ${acceptedParsers.join(", ")}.`,
      status: "error"
    }
  }
  return {
    validated: parserQuery,
    status: "validated"
  }
}