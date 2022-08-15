import {
    Fields,
    Pagination,
    QueryKind,
    QueryObject,
    QueryString,
    QueryStringItem,
    RelationFields,
    Relations
} from './types'


export * from './types'

function getQsFilters(filters: QueryKind): QueryStringItem[] {
    let queryStrings: QueryStringItem[] = []
    Object
        .keys(filters)
        .forEach(key => {
            if (key === 'or' || key === 'and') {
                (filters[key] as Record<string, Record<string, string>>[]).map((queryItem, index) => {
                    Object
                        .keys(queryItem)
                        .forEach(fieldName => {
                            const filterParamsString = Object
                                .keys(queryItem[fieldName])
                                .map(operator => `[${operator}]=${queryItem[fieldName][operator]}`)
                                .join('')
                            queryStrings.push(`filters[${key}][${index}][${fieldName}]${filterParamsString}`)
                        })
                })
            } else {
                Object
                    .keys(filters[key])
                    .forEach(
                        operator => queryStrings.push(`filters[${key}][${operator}]=${filters[key][operator]}`)
                    )
            }
        })
    return queryStrings
}

function getQsRelations(relations: Relations): QueryStringItem[] {
    if (Array.isArray(relations)) return relations.map((relation, index) => `relations[${index}]=${relation}`)
    return [`relations=${relations}`]
}

function getQsFields(fields: Fields): QueryStringItem[] {
    return fields.map((field, index) => `fields[${index}]=${field}`)
}

function getQsRelationFields(relationFields: RelationFields): QueryStringItem[] {
    return Object
        .keys(relationFields)
        .map(modelName => {
            const queryItems: QueryStringItem[] = relationFields[modelName].map((field, index) => `relationFields[${modelName}][${index}]=${field}`)
            return queryItems
        })
        .reduce((qsListAcc, queryItems) => {
            return [...qsListAcc, ...queryItems]
        }, [])
}

function getQsPagination(pagination: Pagination): QueryStringItem[] {
    return Object
        .keys(pagination)
        .map(paginationItemName => `${paginationItemName}=${pagination[paginationItemName as 'page' | 'pageSize']}`)
}

function getQsSort(sort: string): QueryStringItem[] {
    return [`sort=${sort}`]
}

export default function qs(queryObject: QueryObject): QueryString {
    const qsObject: Record<string, QueryStringItem[]> = {
        qsFilters: queryObject.filters ? getQsFilters(queryObject.filters) : [],
        qsRelations: queryObject.relations ? getQsRelations(queryObject.relations) : [],
        qsFields: queryObject.fields ? getQsFields(queryObject.fields) : [],
        qsRelationFields: queryObject.relationFields ? getQsRelationFields(queryObject.relationFields) : [],
        qsPagination: queryObject.pagination ? getQsPagination(queryObject.pagination) : [],
        qsSort: queryObject.sort ? getQsSort(queryObject.sort) : []
    }
    const qsList = Object
        .keys(qsObject)
        .reduce((qsListAcc, queryKey) => {
            return [...qsListAcc, ...qsObject[queryKey]]
        }, [] as QueryStringItem[])
    return qsList.length ? '?' + qsList.join('&') : ''
}
