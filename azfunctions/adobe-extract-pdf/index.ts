import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {Readable} from "stream"
import {extractPdf} from "../lib/adobe/extractPdf"
import {parseTableFormatAbilityRenovation} from "../lib/estimateSheet/table/parseTableFormatAbilityRenovation"


// extracts the table from the given PDF file

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const pdfFileBuffer = req.parseFormBody().get("pdf").value
  const pdfFileStream = Readable.from(pdfFileBuffer)

  const tableCsvText = await extractPdf(pdfFileStream)
  const parsed = parseTableFormatAbilityRenovation(tableCsvText)

  context.res = {
    body: JSON.stringify({text: tableCsvText, table: parsed}),
    headers: {
      "Content-Type": "application/json"
    }
  }
}

export default httpTrigger