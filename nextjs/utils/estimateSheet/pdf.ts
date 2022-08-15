import {EstimateSheet} from "../../types"

type ParsePdfResult = {
  status: "success",
  text: string,
} | {
  status: "failed",
  error: string,
}

const parsePdfUrl = "/api/estimateSheet/parsePdf"
export const parsePdf = async (file: File, page: number): Promise<ParsePdfResult> => {
  const urlParams = new URLSearchParams({page: page.toString()})
  const url = parsePdfUrl + "?" + urlParams.toString()
  const formData = new FormData()
  formData.set("pdf", file)

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    return {
      status: "failed",
      error: (await response.json()).error
    }
  }

  const data = await response.json() as {result: {page: number, text: string}[]}
  const pageData = data.result.find(o => o.page === page)
  const text = pageData? pageData.text: ""

  return {
    status: "success",
    text
  }
}

// setting for parseFormatOptions
const _parseFormatOptions = {
  "abilityRenovation": "アビリティリノベーション"
}

export type ParseFormatOption = keyof typeof _parseFormatOptions

export const parseFormatOptions = Array.from(Object.keys(_parseFormatOptions)) as ParseFormatOption[]

export const getParseFormatOptionLabel = (parseFormatOption: ParseFormatOption): string => {
  return _parseFormatOptions[parseFormatOption]
}

type ParseTextResult = {
  status: "success",
  estimateSheet: EstimateSheet,
} | {
  status: "failed",
  error: string,
}

const parseTextFormatAbilityRenovationUrl = "/api/estimateSheet/parseTextFormatAbilityRenovation"
export const parseTextFormatAbilityRenovation = async (text: string): Promise<ParseTextResult> => {
  const response = await fetch(parseTextFormatAbilityRenovationUrl, {
    method: "POST",
    body: text,
  })
  if (!response.ok) {
    const data = await response.json()
    const error = data.error ?? "不明な理由"
    return {
      status: "failed",
      error
    }
  }

  const data = await response.json()
  return {
    status: "success",
    estimateSheet: data.estimateSheet,
  }
}

export const parseText = async (format: ParseFormatOption, text: string): Promise<ParseTextResult> => {
  switch(format) {
    case "abilityRenovation":
      return parseTextFormatAbilityRenovation(text)
    default:
      throw new Error("Have not implemented yet.")
  }
}