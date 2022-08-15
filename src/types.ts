export type QueryString = string
export type QueryStringItem = string

export type Operator =
    'and'
    | 'or'

export type BooleanMethod =
    'eq'
    | 'ne'
    | 'is'
    | 'not'
    | 'col'

export type NumericMethod =
    'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'between'
    | 'notBetween'

export type ArrayMethod =
    'all'
    | 'in'
    | 'notIn'

export type StringMethod =
    'like'
    | 'notLike'
    | 'startsWith'
    | 'endsWith'
    | 'substring'
    | 'iLike'
    | 'notILike'
    | 'regexp'
    | 'notRegexp'
    | 'iRegexp'
    | 'notIRegexp'

export type MatchMethod =
    'any'
    | 'match'

export type AllowedMethod =
    Operator
    | BooleanMethod
    | NumericMethod
    | ArrayMethod
    | StringMethod
    | MatchMethod

export type QueryKind = {[key: string]: any}

export type Relations = string | string[]

export type Fields = string[]

export type RelationFields = Record<string, string[]>

export type Pagination = {
    page?: number
    pageSize?: number
}

export type QueryObject = {
    filters?: QueryKind
    relations?: Relations
    fields?: Fields
    relationFields?: RelationFields
    pagination?: Pagination
    sort?: string
}
