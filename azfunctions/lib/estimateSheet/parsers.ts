import * as pdfParser from "pdf-parse"
import {EstimateSheet} from "../../types/estimateSheet"
import {parseSimpleTextFormatAbilityRenovation} from "./text/parseSimpleTextFormatAbilityRenovation"
import {extractPdf} from "../adobe/extractPdf"
import {Readable} from "stream"
import {parseTableFormatAbilityRenovation} from "./table/parseTableFormatAbilityRenovation"

export type ParseResult = {
  status: "success",
  estimateSheet: EstimateSheet,
} | {
  status: "failed",
  error: string,
}

export const acceptedFormatsByParser: {[parser: string]: string[]} = {
  simple: [
    "abilityRenovation",
  ],
  adobePdfExtract: [
    "abilityRenovation",
  ]
}

export const simpleParser = async (buffer: Buffer, format: string): Promise<ParseResult> => {
  const {text} = await pdfParser(buffer)

  switch (format) {
    case "abilityRenovation":
      return parseSimpleTextFormatAbilityRenovation(text)
  }

  return {
    status: "failed",
    error: `Format: ${format} is not configured for Parser: simple`
  }
}

export const adobePdfExtractParser = async (buffer: Buffer, format: string): Promise<ParseResult> => {
  const stream = Readable.from(buffer)
  const csvText = await extractPdf(stream)

  switch (format) {
    case "abilityRenovation":
      return parseTableFormatAbilityRenovation(csvText)
  }

  return {
    status: "failed",
    error: `Format: ${format} is not configured for Parser: adobePDFExtract`
  }
}

export const parse = async (buffer: Buffer, parser: string, format: string): Promise<ParseResult> => {
  // check if the parser and format pair is valid
  if (!acceptedFormatsByParser.hasOwnProperty(parser)) {
    return {
      status: "failed",
      error: `Parser: ${parser} is not defined.`
    }
  }
  const found = acceptedFormatsByParser[parser].find(f => f === format)
  if (!found) {
    return {
      status: "failed",
      error: `format: ${format} is not an accepted format for parser: ${parser}.`
    }
  }

  switch (parser) {
    case "simple":
      return simpleParser(buffer, format)
    case "adobePdfExtract":
      return adobePdfExtractParser(buffer, format)
    default:
      return {
        status: "failed",
        error: `Parser ${parser} was not found.`
      }
  }
}