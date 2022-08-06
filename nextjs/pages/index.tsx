import type { NextPage } from 'next'
import {createRef, FormEvent, useState} from "react"

const Home: NextPage = () => {
  const [parsed, setParsed] = useState<string|null>(null)
  const fileInputRef = createRef<HTMLInputElement>()
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    const filesData = fileInputRef.current?.files
    // if no file is set, skip the rest
    if (!filesData || filesData.length === 0) return
    formData.set("pdf", filesData[0])

    const res = await fetch("https://func-h3wybuywzt.azurewebsites.net/api/parse-pdf?code=OLxYoe27n2nHcO-nDcfb1l_oMi6IeHQ9nbDfmBiG6mSDAzFuTifp_g==", {
      method: "POST",
      body: formData
    })
    if (res.ok) {
      const data = await res.json()
      setParsed(data.text)
    }
  }
  return <div>
    <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: 800}}>
      <form onSubmit={onSubmit}>
        <div>
          <input type={"file"} name={"pdf"} ref={fileInputRef}/>
        </div>
        <div>
          <button type={"submit"}>Submit</button>
        </div>
      </form>
    </div>
    <div style={{marginTop: 20, marginRight: "auto", marginLeft: "auto", maxWidth: 800}}>
      <pre>
        {parsed}
      </pre>
    </div>
  </div>
}

export default Home
