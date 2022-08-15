# hans-sequelize-qs
Query string creator for hans-sequelize-api (frontend side)

## Table of contents
* [Installing](#installing)
* [Example](#example)

<a name="installing"><h2>Installing</h2></a>
Add the package to your project
```
npm i hans-sequelize-qs
```
using yarn
```
yarn add hans-sequelize-qs
```


<a name="example"><h2>Example</h2></a>

Export qs from *hans-sequelize-qs*

```javascript
const qs = require('hans-sequelize-qs')
```
using TypeScript
```typescript
import qs, {QueryObject} from 'hans-sequelize-qs'
```


```typescript
const queryObject1: QueryObject = {
    filters: {
        title: {
            startsWith: 'front'
        }
    },
    relations: ['Skill', 'User'],
    fields: ['code', 'title'],
    relationFields: {
        Skill: ['title']
    },
    sort: 'asc:createdAt'
}

const queryObject2: QueryObject = {
    filters: {
        or: [
            {
                title: {
                    startsWith: 'front'
                },
            },
            {
                code: {
                    endsWith: 'front'
                }
            }
        ]
    },
    relations: 'User',
    fields: ['code', 'title'],
    relationFields: {
        User: ['lastName']
    },
    pagination: {
        page: 2,
        pageSize: 5
    }
}

console.log('test-1: ', qs(queryObject1))
// ?filters[title][startsWith]=front&relations[0]=Skill&relations[1]=User&fields[0]=code&fields[1]=title&relationFields[Skill][0]=title&sort=asc:createdAt
console.log('test-2: ', qs(queryObject2))
// ?filters[or][0][title][startsWith]=front&filters[or][1][code][endsWith]=front&relations=User&fields[0]=code&fields[1]=title&relationFields[User][0]=lastName&page=2&pageSize=5
```

