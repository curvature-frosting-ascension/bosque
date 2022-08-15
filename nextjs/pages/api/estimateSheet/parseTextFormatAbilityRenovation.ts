import {NextApiHandler} from "next"

const handler: NextApiHandler = async (req, res) => {
  const text: string = req.body
  if (!text) {
    res.status(400).json({error: "text to be parsed was not provided."})
    return
  }

  const apiKey = process.env["AZURE_FUNCTIONS_API_KEY"]
  if (!apiKey) {
    res.status(500).json({error: "AZURE_FUNCTIONS_API_KEY is not set."})
    return
  }

  const apiResponse = await fetch("https://func-bosque.azurewebsites.net/api/parse-text-format-ability-renovation", {
    method: "POST",
    body: text,
    headers: {
      "Content-Type": "plain/text",
      "x-functions-key": apiKey
    }
  })
  res.status(apiResponse.status).json(await apiResponse.json())
}

export default handler