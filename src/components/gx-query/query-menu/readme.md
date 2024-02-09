# gx-query-menu



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute              | Description                                                                                                                                                                                                                                                                                          | Type                                 | Default                                                                                                                                                                                                                                                    |
| ------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessibleName`    | `accessible-name`      | Specifies a short string, typically 1 to 3 words, that authors associate with an element to provide users of assistive technologies with a label for the element.                                                                                                                                    | `"Query list"`                       | `"Query list"`                                                                                                                                                                                                                                             |
| `apiKey`            | `api-key`              | This is GxQuery authentication key. It will required when property useGxQuery = true                                                                                                                                                                                                                 | `string`                             | `""`                                                                                                                                                                                                                                                       |
| `baseUrl`           | `base-url`             | This is the GxQuery base URL. It will required when property useGxQuery = true                                                                                                                                                                                                                       | `string`                             | `""`                                                                                                                                                                                                                                                       |
| `groupItemsByMonth` | `group-items-by-month` | Show queries items group by month                                                                                                                                                                                                                                                                    | `boolean`                            | `true`                                                                                                                                                                                                                                                     |
| `metadataName`      | `metadata-name`        | This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true. In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property) | `""`                                 | `""`                                                                                                                                                                                                                                                       |
| `rangeOfDays`       | --                     | Dates to group queries                                                                                                                                                                                                                                                                               | `{ days: number; label: string; }[]` | `[     { days: 0, label: "Today" },     { days: 1, label: "Yesterday" },     { days: 3, label: "Previous 3 days" },     { days: 5, label: "Previous 5 Days" },     { days: 7, label: "Previous 7 Days" },     { days: 10, label: "Previous 10 Days" }   ]` |
| `saiaToken`         | `saia-token`           | This is GxQuery Saia Token. It will required when property useGxQuery = true                                                                                                                                                                                                                         | `string`                             | `""`                                                                                                                                                                                                                                                       |
| `saiaUserId`        | `saia-user-id`         | This is GxQuery Saia User ID (optional). It will use when property useGxQuery = true                                                                                                                                                                                                                 | `string`                             | `""`                                                                                                                                                                                                                                                       |
| `serializedObject`  | `serialized-object`    | Use this property to pass a query obtained from GXquery. This disabled the call to GxQuery API:    Id: string;    Name: string;    Description: string;    Expression: string;    Modified: string;                                                                                                  | `string`                             | `undefined`                                                                                                                                                                                                                                                |
| `useGxquery`        | `use-gxquery`          | True to tell the controller to connect use GXquery as a queries repository                                                                                                                                                                                                                           | `boolean`                            | `true`                                                                                                                                                                                                                                                     |


## Events

| Event           | Description    | Type                                                                                                                                                                |
| --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gxQueryDelete` | Delete query   | `CustomEvent<Omit<QueryViewerBase, "modified"> & { id: string; name: string; description: string; modified: Date; expression: string; differenceInDays: number; }>` |
| `gxQueryRename` | Rename query   | `CustomEvent<Omit<QueryViewerBase, "modified"> & { id: string; name: string; description: string; modified: Date; expression: string; differenceInDays: number; }>` |
| `gxQuerySelect` | Select a query | `CustomEvent<Omit<QueryViewerBase, "modified"> & { id: string; name: string; description: string; modified: Date; expression: string; differenceInDays: number; }>` |


## Methods

### `gxAddQuery(item: GxQueryItem) => Promise<void>`

Add a new query item

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part           | Description |
| -------------- | ----------- |
| `"list-item"`  |             |
| `"loading"`    |             |
| `"menu-title"` |             |


## Dependencies

### Depends on

- [gx-query-menu-item](../query-menu-item)
- gx-loading

### Graph
```mermaid
graph TD;
  gx-query-menu --> gx-query-menu-item
  gx-query-menu --> gx-loading
  gx-query-menu-item --> gx-edit
  gx-loading --> gx-lottie
  style gx-query-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
