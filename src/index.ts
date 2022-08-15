import {
    Fields,
    Pagination,
    Filters,
    QueryObject,
    QueryString,
    QueryStringItem,
    RelationFields, RelationFilters,
    Relations, RelationSort
} from './types'


export * from './types'

function getQsFilters(filters: Filters, isRelation: boolean = false): QueryStringItem[] {
    let queryStrings: QueryStringItem[] = []

    const filtersLabel = isRelation ? 'relationFilters' : 'filters'

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
                            queryStrings.push(`${filtersLabel}[${key}][${index}][${fieldName}]${filterParamsString}`)
                        })
                })
            } else {
                Object
                    .keys(filters[key])
                    .forEach(
                        operator => queryStrings.push(`${filtersLabel}[${key}][${operator}]=${filters[key][operator]}`)
                    )
            }
        })
    return queryStrings
}

function getQsRelationFilters(relationFilters: RelationFilters): QueryStringItem[] {
    return Object
        .keys(relationFilters)
        .map(relation => getQsFilters(relationFilters[relation], true))
        .reduce((qsListAcc, queryItems) => {
            return [...qsListAcc, ...queryItems]
        }, [])
}

function getQsRelations(relations: Relations): QueryStringItem[] {
    if (Array.isArray(relations)) return relations.map((relation, index) => `relations[${index}]=${relation}`)
    return [`relations[0]=${relations}`]
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

function getQsRelationSort(relationSort: RelationSort): QueryStringItem[] {
    return Object
        .keys(relationSort)
        .map(relation => `relationSort[${relation}]=${relationSort[relation]}`)
}

export default function qs(queryObject: QueryObject): QueryString {

    const qsObject: Record<string, QueryStringItem[]> = {
        qsFilters: queryObject.filters ? getQsFilters(queryObject.filters) : [],
        qsRelations: queryObject.relations ? getQsRelations(queryObject.relations) : [],
        qsFields: queryObject.fields ? getQsFields(queryObject.fields) : [],
        qsRelationFields: queryObject.relationFields ? getQsRelationFields(queryObject.relationFields) : [],
        qsRelationFilters: queryObject.relationFilters ? getQsRelationFilters(queryObject.relationFilters) : [],
        qsPagination: queryObject.pagination ? getQsPagination(queryObject.pagination) : [],
        qsSort: queryObject.sort ? getQsSort(queryObject.sort) : [],
        qsRelationSort: queryObject.relationSort ? getQsRelationSort(queryObject.relationSort) : []
    }
    const qsList = Object
        .keys(qsObject)
        .reduce((qsListAcc, queryKey) => {
            return [...qsListAcc, ...qsObject[queryKey]]
        }, [] as QueryStringItem[])
    return qsList.length ? '?' + qsList.join('&') : ''
}
