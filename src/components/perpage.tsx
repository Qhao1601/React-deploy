import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

interface IPerpagePros {
    onChange?: (value: number) => void, //  callback khi chọn number
    defaulvalue?: number // giá trị mặc định
}

export const Perpage = ({ onChange, defaulvalue = 20 }: IPerpagePros) => {

    const [perpage, setPerpage] = useState(defaulvalue);
    // truyền value là number mình chọn
    const handleChange = (value: string) => {
        // ép kiểu về kiểu số
        const numberValue = parseInt(value)
        // cập nhật lại giá trị perpage khi mình đã chọn
        setPerpage(numberValue)
        // gọi lại giá trị cha để cập nhật lại biết khi mình vừa chọn gì
        if (onChange) {
            // number là giá trị mình vựa chọn
            onChange(numberValue)
        }
    }
    // sau đó sử dụng useEffect là tự động nếu defaulvalue thay đổi thi setperpage xét lại giá cho perpage
    useEffect(() => {
        setPerpage(defaulvalue)
    }, [defaulvalue]);



    return (
        <Select value={perpage.toString()} onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
                {[10, 20, 30, 40].map((value) => (
                    <SelectItem key={value.toString()} value={value.toString()}>{value.toString()} bản ghi</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}