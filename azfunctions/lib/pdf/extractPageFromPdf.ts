import { PDFDocument } from "pdf-lib"

export const extractPageFromPdf = async (pdfFileBuffer: Buffer, page: number): Promise<Buffer> => {
  const pdfDocument = await PDFDocument.load(pdfFileBuffer)

  const newDocument = await PDFDocument.create()
  const [copiedPage] = await newDocument.copyPages(pdfDocument, [page-1])
  newDocument.addPage(copiedPage)
  const newBytes = await newDocument.save()

  return Buffer.from(newBytes)
}