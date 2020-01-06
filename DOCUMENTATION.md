#### normalize(obj) 

Normalize object to remove unused properties




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| obj | `object`  | valid object to normalize. | &nbsp; |




##### Examples

```javascript

normalize(obj);
// => { ... }
```


##### Returns


- `object`  normalize object



#### parseAlert(alertXml) 

Parse given alert from xml to json




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| alertXml | `string`  | valid alert xml. | &nbsp; |




##### Examples

```javascript

parseAlert(alertXml)
  .then(alert => { ... }) // => { identifier: ..., info: { ... } }
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with alert on success or error on failure.



#### parseFeed(source) 

Parse given alert feed from xml to json




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| source | `object`  | valid alert feed readable stream. | &nbsp; |




##### Examples

```javascript

parseFeed(readableStream)
  .then(feed => { ... }) // => { channel: ..., items: { ... } }
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with alert feed on success or error on failure.



#### fetchAlert(optns) 

Issue http get request to fetch specific alert.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | valid fetch options. | &nbsp; |
| optns.url | `string`  | valid alert full url. | &nbsp; |




##### Examples

```javascript

const optns = { url: ... };
fetchAlert(optns)
  .then(alert => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with alert in CAP format on success or error on failure.



#### fetchFeed(optns) 

Issue http get request to fetch alerts feed.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | valid fetch options. | &nbsp; |
| optns.url | `string`  | valid alert feed full url. | &nbsp; |




##### Examples

```javascript

const optns = { url: ... };
fetchFeed(optns)
  .then(alert => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with alerts in feed format on success or error on failure.



#### fetchAlerts(optns) 

Issue http get request to fetch alerts from feed.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | valid fetch options. | &nbsp; |
| optns.url | `string`  | valid alert feed full url. | &nbsp; |




##### Examples

```javascript

const optns = { url: ... };
fetchAlerts(optns)
  .then(alert => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with alerts in CAP format on success or error on failure.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
