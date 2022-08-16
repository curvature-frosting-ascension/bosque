import * as PDFServicesSdk from "@adobe/pdfservices-node-sdk"
import {Readable} from "stream"
import * as StreamZip from "node-stream-zip"
import * as fs from "fs"

export const extractPdf = async (stream: Readable): Promise<string> => {
  const credentials = PDFServicesSdk.Credentials
    .serviceAccountCredentialsBuilder()
    .withClientId(process.env["AdobePdfExtractApiClientId"])
    .withClientSecret(process.env["AdobePdfExtractApiClientSecret"])
    .withAccountId(process.env["AdobePdfExtractApiAccountId"])
    .withOrganizationId(process.env["AdobePdfExtractApiOrganizationId"])
    .withPrivateKey(process.env["AdobePdfExtractApiPrivateKey"])
    .build()

  // create execution context
  const executionContext = PDFServicesSdk.ExecutionContext.create(credentials)

  // build extract pdf options
  const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
    .addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT)
    .addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TABLES)
    .addElementsToExtractRenditions(PDFServicesSdk.ExtractPDF.options.ExtractRenditionsElementType.TABLES)
    .addTableStructureFormat(PDFServicesSdk.ExtractPDF.options.TableStructureType.CSV)
    .build()

  const input = PDFServicesSdk.FileRef.createFromStream(stream, PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf)

  // create a new operation instance
  const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew()

  // set input and options
  extractPDFOperation.setInput(input)
  extractPDFOperation.setOptions(options)

  const executionResult = await extractPDFOperation.execute(executionContext)
  await executionResult.saveAsFile("output/table.zip")

  const zip = new StreamZip.async({file: "output/table.zip"})
  const data = await zip.entryData("tables/fileoutpart0.csv")
  await zip.close()

  await fs.promises.unlink("output/table.zip")

  const text = data.toString("utf-8")
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.substring(1)
  }
  return text
}