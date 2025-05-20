"use client"
import { useEmailTemplate, useUserDetail } from "@/app/provider"
import Canvas from "@/components/custom/Canvas"
import EditorHeader from "@/components/custom/EditorHeader"
import { ElementSideBar } from "@/components/custom/ElementSideBar"
import Setting from "@/components/custom/Setting"
import { api } from "@/convex/_generated/api"
import { useConvex } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const Editor = () => {
  const [viewHTMLcode, setviewHTMLcode] = useState()
  const { templateId } = useParams()
  const convex = useConvex()

  const { userdetail } = useUserDetail()
  const { setEmailTemplate } = useEmailTemplate()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userdetail) {
      GetTemplateData()
    }
  }, [userdetail])

  const GetTemplateData = async () => {
    setLoading(true)
    try {
      const result = await convex.query(api.emailTemplate.GetTemplateDesign, {
        tId: String(templateId),
        email: userdetail?.email,
        
      })
      setEmailTemplate(result?.design)
    } catch (error) {
      console.log("Template fetch error", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      <EditorHeader viewHTMLcode={(v) => setviewHTMLcode(v)}  isNew={true}/>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          <span className="ml-3 text-gray-600 font-medium">Loading template...</span>
        </div>
      ) : (
        <div className="grid grid-cols-5 h-full">
          {/* Sidebar */}
          <div className="bg-white border-r h-full overflow-y-auto">
            <ElementSideBar />
          </div>

          {/* Canvas Area */}
          <div className="col-span-3 bg-gray-200 h-full overflow-y-auto p-4">
            <Canvas viewHTMLcode={viewHTMLcode} closeDialog={() => setviewHTMLcode(false)} />
          </div>

          {/* Settings */}
          <div className="bg-white border-l h-full overflow-y-auto">
            <Setting />
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor
