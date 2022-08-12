import {EstimateSheet} from "../../types"

type ParsePdfResult = {
  status: "success",
  text: string,
} | {
  status: "failed",
  error: string,
}

const parsePdfUrl = "https://func-bosque.azurewebsites.net/api/parse-pdf"
export const parsePdf = async (file: File, page: number): Promise<ParsePdfResult> => {
  const urlParams = new URLSearchParams({page: page.toString()})
  const url = parsePdfUrl + "?" + urlParams.toString()
  const formData = new FormData()
  formData.set("pdf", file)

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      "x-functions-key": "Nhk6lk4AC6SMZvZPxSuSqykocto77sxPeZh2vAezwPrvAzFuLXjz4A=="
    }
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

type ParseTextResult = {
  status: "success",
  estimateSheet: EstimateSheet,
} | {
  status: "failed",
  error: string,
}

export const parseTextFormatAbilityRenovation = async (text: string): Promise<ParseTextResult> => {
  const response = await fetch(" https://func-bosque.azurewebsites.net/api/parse-text-format-ability-renovation", {
    method: "POST",
    body: text,
    headers: {
      "x-functions-key": "Nhk6lk4AC6SMZvZPxSuSqykocto77sxPeZh2vAezwPrvAzFuLXjz4A=="
    }
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