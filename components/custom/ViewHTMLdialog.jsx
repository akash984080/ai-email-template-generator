import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Copy } from "lucide-react"


function ViewHTMLDialog({ openDialog, HTMLcode, closeDialog }) {
   const copyCode = ()=>{
    navigator.clipboard.writeText(HTMLcode)
   }
    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <div className="flex items-center justify-between">
                            <h2>HTML Email template</h2>
                            <Copy onClick={copyCode} className="p-2 bg-gray-100 rounded-lg h-9 w-9  cursor-pointer"/>
                        </div>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="max-h-[400px] overflow-auto bg-black text-white rounded-lg p-5">
                            <pre className="whitespace-pre-wrap break-all">
                                <code>
                                    {HTMLcode}
                                </code>
                            </pre>

                        </div>
                    </DialogDescription>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}


export default ViewHTMLDialog