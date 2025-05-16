import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRef, useState, memo, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Trash } from "lucide-react"
import { IAlbum } from "@/interfaces/post/post-catalogues.interface"
import { isApiSuccessResponse } from "@/interfaces/api.response"



interface IalbumProps {
    data: IAlbum[]
}

const Album = ({
    data
}: IalbumProps) => {
    const { setValue, getValues } = useFormContext()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [existingImage, setExistingImage] = useState<IAlbum[]>([])

    useEffect(() => {
        if (data && data.length > 0) {
            setExistingImage(data)
        }
    }, [data])


    const handleFileChange = (fileList: FileList | null) => {
        if (!fileList) return
        const newFiles = Array.from(fileList)
        const newPreview = newFiles.map((file) => URL.createObjectURL(file))
        const updateFiles = [...files, ...newFiles]
        setPreview((prev) => [...prev, ...newPreview])
        setFiles(updateFiles)
        setValue("album", updateFiles, { shouldValidate: true })
    }

    const handleDelete = (index: number) => {
        const updateFiles = files.filter((_, i) => i !== index)
        const updatePreview = preview.filter((_, i) => i !== index)
        setFiles(updateFiles)
        setPreview(updatePreview)
        setValue("album", updateFiles, { shouldValidate: true })
    }

    const handleDeleteExistingImage = (index: number) => {
        const imageToRemove = existingImage[index]
        const updateImage = existingImage.filter((_, i) => i !== index)
        setExistingImage(updateImage)
        const removeImage = getValues('removeImages') || []
        setValue("removeImages", [...removeImage, imageToRemove.fullPath], { shouldValidate: true })
    }


    const hasImage = preview.length > 0 || existingImage.length > 0
    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal uppercase">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px]">Ablum ảnh</span>
                            <span className="text-[13px] text-[blue] cursor-pointer" onClick={() => fileInputRef.current?.click()}>Chọn hình ảnh</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files)}
                    />
                    {!hasImage ? (
                        <div className="border border-dashed border-gray-500 rounded-[5px] text-center p-[10px]">
                            <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <svg className="size-[80px] fill-[#d3dbe2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path d="M80 57.6l-4-18.7v-23.9c0-1.1-.9-2-2-2h-3.5l-1.1-5.4c-.3-1.1-1.4-1.8-2.4-1.6l-32.6 7h-27.4c-1.1 0-2 .9-2 2v4.3l-3.4.7c-1.1.2-1.8 1.3-1.5 2.4l5 23.4v20.2c0 1.1.9 2 2 2h2.7l.9 4.4c.2.9 1 1.6 2 1.6h.4l27.9-6h33c1.1 0 2-.9 2-2v-5.5l2.4-.5c1.1-.2 1.8-1.3 1.6-2.4zm-75-21.5l-3-14.1 3-.6v14.7zm62.4-28.1l1.1 5h-24.5l23.4-5zm-54.8 64l-.8-4h19.6l-18.8 4zm37.7-6h-43.3v-51h67v51h-23.7zm25.7-7.5v-9.9l2 9.4-2 .5zm-52-21.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm-13-10v43h59v-43h-59zm57 2v24.1l-12.8-12.8c-3-3-7.9-3-11 0l-13.3 13.2-.1-.1c-1.1-1.1-2.5-1.7-4.1-1.7-1.5 0-3 .6-4.1 1.7l-9.6 9.8v-34.2h55zm-55 39v-2l11.1-11.2c1.4-1.4 3.9-1.4 5.3 0l9.7 9.7c-5.2 1.3-9 2.4-9.4 2.5l-3.7 1h-13zm55 0h-34.2c7.1-2 23.2-5.9 33-5.9l1.2-.1v6zm-1.3-7.9c-7.2 0-17.4 2-25.3 3.9l-9.1-9.1 13.3-13.3c2.2-2.2 5.9-2.2 8.1 0l14.3 14.3v4.1l-1.3.1z"></path></svg>
                                <p className="text-sm text-gray-500">
                                    Sử dụng nút chọn hình ảnh hoặc click vào đây để thêm hình ảnh album
                                </p>
                            </div>
                        </div>
                    ) :
                        (
                            <div className="grid grid-cols-8 gap-4">
                                {existingImage.map((item, index) => (
                                    <div key={index} className="w-full h-[130px] relative">
                                        <img src={item.fullPath} alt="" className="object-cover size-full" />
                                        <Trash className="absolute top-0 right-0 w-[16px] h-[20px] text-white bg-[#d23131]" onClick={() => handleDeleteExistingImage(index)} />
                                    </div>
                                ))}
                                {preview.map((src, index) => (
                                    <div key={index} className="w-full h-[130px] relative">
                                        <img src={src} alt="" className="object-cover size-full" />
                                        <Trash className="absolute top-0 right-0 w-[16px] h-[20px] text-white bg-[#d23131]" onClick={() => handleDelete(index)} />
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        </>
    )
}

export default Album