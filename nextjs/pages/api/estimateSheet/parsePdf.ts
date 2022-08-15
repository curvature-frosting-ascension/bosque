import {NextApiHandler} from "next"
import * as getRawBody from "raw-body"

export const config = {
  api: {
    bodyParser: false,
  }
}

const handler: NextApiHandler = async (req, res) => {
  const pageQuery = req.query.page
  if (!pageQuery || Array.isArray(pageQuery)) {
    res.status(400).send("0 or too many pages in the request param.")
    return
  }
  const page = parseInt(pageQuery, 10)
  if (!Number.isFinite(page)) {
    res.status(400).send("page is not a valid number.")
    return
  }

  const apiKey = process.env["AZURE_FUNCTIONS_API_KEY"]
  if (!apiKey) {
    res.status(500).json({error: "AZURE_FUNCTIONS_API_KEY is not set."})
    return
  }

  const apiResponse = await fetch(`https://func-bosque.azurewebsites.net/api/parse-pdf?page=${pageQuery}`, {
    method: "POST",
    body: await getRawBody.default(req),
    headers: {
      "Content-Type": req.headers["content-type"] || "",
      "x-functions-key": apiKey
    }
  })
  res.status(apiResponse.status).json(await apiResponse.json())
}

export default handler