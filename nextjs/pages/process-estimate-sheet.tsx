import type { NextPage } from 'next'
import {Layout} from "../components/Layout"
import {ProcessEstimateSheetPage} from "../components/pages/process-estimate-sheet"

const Page: NextPage = () => {
  return <Layout>
    <ProcessEstimateSheetPage />
  </Layout>
}

export default Page