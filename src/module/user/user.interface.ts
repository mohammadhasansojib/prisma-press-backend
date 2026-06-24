
export type TMeta = {
    page: number,
    limit: number,
    total: number,
}


export type TResponseData<T> = {
    success: boolean,
    message: string,
    statusCode: number,
    data: T,
    meta?: TMeta,
}