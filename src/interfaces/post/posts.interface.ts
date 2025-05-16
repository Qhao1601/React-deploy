import { IPostCatalogue } from "./post-catalogues.interface"


export interface IPosts {
    id: number,
    name: string,
    canonical: string,
    publish: number,
    creator: string,
    description: string,
    content: string,
    metaTitle: string,
    metaDescription: string,
    metaKeyword: string
    level: number,
    image: string,
    album: IAlbum[],
    postCatalogueId: string,
    postCatalogues: number[],
    postCatalogue: IPostCatalogue

}

export interface IAlbum {
    path: string,
    fullPath: string
}

export interface IPostsRequest {
    name: string,
    postCatalogueId: string
    publish: string,
    description?: string,
    content?: string,
    metaTitle?: string,
    metaKeyword?: string,
    metaDescription?: string,
    canonical: string,
    image?: File | undefined | null,
    album?: File[]
    userId: number | undefined,
    removeImages: string[],
    postCatalogues: number[],

}