import {AzureFunction, Context, HttpRequest} from "@azure/functions"
import {validateFormatQuery, validatePageQuery, validateParserQuery} from "./utils"
import {parse} from "../lib/estimateSheet/parsers"
import {extractPageFromPdf} from "../lib/pdf/extractPageFromPdf"

const acceptedParsers = [
  "simple",
  "adobePdfExtract"
]

const acceptedFormats = [
  "abilityRenovation"
]

const help = `
extracts the estimateSheet from the given PDF file.
request query must contain:
  page: must be a valid page number.
  format: must be one of ${acceptedFormats.join(", ")}
  parser: must be one of ${acceptedParsers.join(", ")}
`

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // if help=true, return the help message
  const helpQuery = req.query.help
  if (helpQuery) {
    context.res = {
      status: 200,
      body: help,
      headers: {
        "Content-Type": "plain/text"
      }
    }
    return
  }

  // validate page query
  const pageValidationResult = validatePageQuery(req.query.page)
  if (pageValidationResult.status === "error") {
    context.res = {
      status: 400,
      body: JSON.stringify({error: pageValidationResult.error}),
      headers: {
        "Content-Type": "application/json"
      }
    }
    return
  }

  // validate format query
  const formatValidationResult = validateFormatQuery(req.query.format, acceptedFormats)
  if (formatValidationResult.status === "error") {
    context.res = {
      status: 400,
      body: JSON.stringify({error: formatValidationResult.error}),
      headers: {
        "Content-Type": "application/json"
      }
    }
    return
  }

  // validate parser query
  const parserValidationResult = validateParserQuery(req.query.parser, acceptedParsers)
  if (parserValidationResult.status === "error") {
    context.res = {
      status: 400,
      body: JSON.stringify({error: parserValidationResult.error}),
      headers: {
        "Content-Type": "application/json"
      }
    }
    return
  }

  const page = pageValidationResult.validated
  const format = formatValidationResult.validated
  const parser = parserValidationResult.validated

  const pdfFileBuffer = req.parseFormBody().get("pdf").value
  const targetPageBuffer = await extractPageFromPdf(pdfFileBuffer, page)

  const result = await parse(targetPageBuffer, parser, format)

  context.res = {
    body: JSON.stringify({result}),
    headers: {
      "Content-Type": "application/json"
    }
  }
}

export default httpTrigger