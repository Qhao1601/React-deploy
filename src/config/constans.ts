
export interface IPublish {
    label: string,
    value: number
}


export interface ISelectOptionItem {
    label: string,
    value: string
}

export interface IFilterSelectConfig {
    id: string,
    name: string,
    placeholder: string,
    options: ISelectOptionItem[],
    defaultValues?: string
}

export interface IFilterExtraProps {
    filters: IFilterSelectConfig[],
    onchange?: (filterId: string, value: string) => void
}

export const Publish: IPublish[] = [
    {
        label: "Không xuất bản",
        value: 1
    },
    {
        label: "Xuất bản",
        value: 2
    },
]

export const commonExtraFilter: IFilterSelectConfig[] = [
    {
        id: "publish",
        name: "publish",
        placeholder: "Chọn trạng thái",
        options: [
            { label: "Chọn tất cả", value: "0" },
            ...Publish.map((item) => ({
                label: item.label,
                value: item.value.toString()
            }))
        ]
    }
]