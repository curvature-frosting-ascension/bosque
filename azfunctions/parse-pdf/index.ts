import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { PDFDocument } from "pdf-lib"
import * as pdfParser from "pdf-parse"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const pdfFileBuffer = req.parseFormBody().get("pdf").value
    const targetPages = req.query.page.split(",").map(s => parseInt(s, 10))
    const pdfDocument = await PDFDocument.load(pdfFileBuffer)
    const pdfPages = pdfDocument.getPages()
    const result = []
    for (const page of targetPages) {
        if (page > pdfPages.length) continue
        const newDocument = await PDFDocument.create()
        const [copiedPage] = await newDocument.copyPages(pdfDocument, [page-1])
        newDocument.addPage(copiedPage)
        const newBytes = await newDocument.save()
        const parsed = await pdfParser(Buffer.from(newBytes))
        result.push({
            page,
            text: parsed.text
        })
    }

    context.res = {
        body: JSON.stringify({result}),
        headers: {
            "Content-Type": "application/json"
        }
    }
}

export default httpTrigger