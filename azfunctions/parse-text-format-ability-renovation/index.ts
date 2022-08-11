import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const text: string = req.body || ""
    if (!text) {
        context.res = {
            status: 400,
            body: JSON.stringify({
                error: "the text to be parsed was not provided in the request body/"
            })
        }
        return
    }

    const lines = text
      .split("\n")
      .map(line => line.trim())
      .map(line => {
          if (line === "単価金 額") return ["単価", "金 額"]
          return line
      })
      .flat()

    const rowNameLineIndex = lines.findIndex(line => line === "名    称")
    const specificationLineIndex = lines.findIndex(line => line === "仕様・規格")
    const unitIndex = lines.findIndex(line => line === "単 位")
    const quantityIndex = lines.findIndex(line => line === "数 量")
    const pricePerUnitIndex = lines.findIndex(line => line === "単価")
    const priceIndex = lines.findIndex(line => line === "金 額")
    const noteIndex = lines.findIndex(line => line === "備考")

    const rowNames = lines.slice(rowNameLineIndex+1, specificationLineIndex)
    const specifications = lines.slice(specificationLineIndex+1, unitIndex)
    const units = lines.slice(unitIndex+1, quantityIndex)
    const quantities = lines.slice(quantityIndex+1, pricePerUnitIndex)
    const pricePerUnits = lines.slice(pricePerUnitIndex+1, priceIndex)
    const prices = lines.slice(priceIndex+1, noteIndex)
    const notes = lines.slice(noteIndex+1)

    context.res = {
        body: JSON.stringify({
            rowNames,
            specifications,
            units,
            quantities,
            pricePerUnits,
            prices,
            notes
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}

export default httpTrigger