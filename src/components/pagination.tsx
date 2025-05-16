import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { ILink } from "@/interfaces/paginate.response"

export interface IPaginateProps {
    links: ILink[],
    onPageChange: (page: number) => void,
    className?: string,
    from?: number,
    to?: number,
    total?: number,
    perpage?: number,
    currentPage?: number
}

const PaginateComponent = ({
    links,
    onPageChange,
    currentPage = 1
}: IPaginateProps) => {

    if (!links || links.length === 0) return null;

    const handleClick = (page: number) => {
        onPageChange(page)
    }

    const prevLink = links.find((link) => link.label === 'pagination.previous')
    const nextLink = links.find((link) => link.label === 'pagination.next')

    // tìm duyệt qua bỏ các pagination.previous , next chỉ để lại label 123456 số trang
    const PaginationLinks = links.filter((link) => link.label !== 'pagination.previous' && link.label !== 'pagination.next')

    return (
        <Pagination>
            <PaginationContent>
                {prevLink && (
                    <PaginationItem>
                        <PaginationPrevious href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (prevLink.url) {
                                    handleClick(currentPage - 1)
                                }
                            }}
                        />
                    </PaginationItem>
                )}
                {PaginationLinks.map((link, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handleClick(parseInt(link.label))
                            }}
                            isActive={link.active}
                        >{link.label}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                {nextLink && (
                    <PaginationItem>
                        <PaginationNext href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (nextLink.url) {
                                    handleClick(currentPage + 1)
                                }
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}

export default PaginateComponent