# gx-query-chat



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                                                                                                                                                                                          | Type     | Default                            |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------- |
| `apiKey`          | `api-key`           | Authentication API Key                                                                                                                                                                                                                                                                               | `string` | `process.env.GENEXUS_API_KEY`      |
| `baseUrl`         | `base-url`          | Base URL of the server                                                                                                                                                                                                                                                                               | `string` | `process.env.GENEXUS_QUERY_URL`    |
| `messageIconSize` | `message-icon-size` | Specify the size of the icon messages. ex 50px                                                                                                                                                                                                                                                       | `string` | `"40px"`                           |
| `metadataName`    | `metadata-name`     | This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true. In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property) | `""`     | `""`                               |
| `placeholder`     | `placeholder`       | Text that appears in the input control when it has no value set                                                                                                                                                                                                                                      | `string` | `"Ask me question"`                |
| `saiaToken`       | `saia-token`        | Authentication Saia Token                                                                                                                                                                                                                                                                            | `string` | `process.env.GENEXUS_SAIA_TOKEN`   |
| `saiaUserId`      | `saia-user-id`      | Optional Saia user ID                                                                                                                                                                                                                                                                                | `string` | `process.env.GENEXUS_SAIA_USER_ID` |


## Events

| Event                 | Description                              | Type                                |
| --------------------- | ---------------------------------------- | ----------------------------------- |
| `gxAssistantResponse` | Fired when receive a question answer     | `CustomEvent<QueryViewerBase>`      |
| `gxUserRequest`       | Fired each time the user make a question | `CustomEvent<{ message: string; }>` |


## Methods

### `gxCleanChat() => Promise<void>`

Clean chat

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"chat-history"` |             |


## Dependencies

### Depends on

- gx-loading
- gx-icon
- gx-textblock
- gx-button
- gx-edit

### Graph
```mermaid
graph TD;
  gx-query-chat --> gx-loading
  gx-query-chat --> gx-icon
  gx-query-chat --> gx-textblock
  gx-query-chat --> gx-button
  gx-query-chat --> gx-edit
  gx-loading --> gx-lottie
  style gx-query-chat fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
