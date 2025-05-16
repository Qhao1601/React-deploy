export type TBreadcrumbItem = {
    label: string;
}
export type DashboardLayoutContext = {
    setHeading: (heading: string) => void
}


export type IColumn = {
    key?: string,
    label?: string,
    className?: string,
    align?: string
}