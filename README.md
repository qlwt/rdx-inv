# Introduction

Following project is a job-application pre-interview task
Otherwise it is an exploration of an application of `Redux` as a `Remote State` Management System

The App itself is a simple Inventory Management App

# Steps to setup locally

- clone
- fill in .env files in `/pckg/cst` and `/compose.yaml`, following `.env.example` files
- run docker container

## Project Structure

- `app/web` is a web client itself
- `app/api` is an api client
- `pckg/rest` contains most of the server side logic regarding rest-api routes, externalised for the sake of typesafety
- `pckg/capi` is a client API for typesafe and convenient calls to rest api
- `pckg/gstate` defines a layer of managing `Remote State` with `Redux`
- `pckg/express-utils` is a simple express wrapper library, that allows automatic response type inference
- `pckg/cst` contains project-wide constants
- `pckg/std` `pckg/std-react` are collections of standard utilities
- `pckg/rest/src/db/db.sql` - database initialisation file

## Definitions

- `Product` - a single `Item` in `Inventory` with certain characteristics, such as:
    - `price` in UAH and USD
    - `name` and `specification` - simpl textual identifiers
    - `wear` - wether it is new or was used
    - `availability` - wether it is currently available
    - `Group` - visual identifier
- `Group` serves as a visual identifier for a `Product`
    - User can create as many `Groups` as he wants
    - User can upload image for a `Group` and change its `title`
    - User can assign `Group` to a `Product` for identification and search
- `Order` represents an outgoing event for a set of `Products`
    - `Order` itself has identifiers such as `title` and `description`
    - It contans `send` information: date and textual record
    - Properties of `Total Price` and `Product Count` are derived from `Products` it contains
    - User can add `Products` to the `Order`
    - When `Order` is deleted, it is considered to be fulfilled, therefore all `Products` it contains are deleted too

## Remote State Management System

- `pckg/rest` exports `rapi` (rest-api) and `rxapi` (rest-extended-api) that contain
    - `rapi` exports standardised set of routes for each `Public Table` of the `Database`
    - `Cluster` for each `Public Table` is called as it's `Public Key`
    - `rxapi` is unstructured and is used as non-standard instruction set
- `pckg/capi`
    - `send_` implement interface of calling standard routes for each `Public Table`
    - `sendx_` are custom calls to `rxapi` that can not be standardised due to unstructured nature of `rxapi`
- `pckg/gstate`
    - for each `Public Table` a `Rem Cluster` is created, they are aggregated in `rem` export
    - `RemCluster` consists of: standardised generic `redux slice`, `actions`, `middleware`
    - `RemSlice` consists of the following:
        - `ent` - normalised entity storage
        - `rempag` - pagination records, sorted by the hash of selector
        - `remlog` - temporary state of ongoing remote requests (it is cleard after the request, so `log` is a bad name)
    - Each `RemSlice` implements standard reactions to standard actions (`load`, `pagload`, `patch`, `post`, `delete`)
    - Each `RemSlice` can be extended to handle `remx` actions
    - Coordination between `RemSlices` is done with shared `thunks` or `GlobalEvents` (e.g. for parsing normalised graph response for `GET` requests)
    - `RemNode` is an single entity of `Public Table`
    - `RemView` is an optimistic view of such entity. It combines node with ongoing `patch`, `post`, `delete` requests

    - To get `RemView`, you combine `RemNode` with `RemLog`
    - To get all available `RemNode`, you just use standard `EntityAdapter` selectors
    - To get all available `RemNode` inside of `RemPag` (paginated list), you use limit previously obtained list up to `cursor` in `RemPag` + apply filters

## Backend

- Exceedingly simple, uses `postgresql` for database management, setups one `WebSocket`
- Did not have enough time to automate `RestAPI` generation, so queries are written by-hand
- Implements four standard routes for each `Public Table`
    - `delete/:id` - deletes node and everything related to it
    - `patch/:id` - updates the node
    - `post` - posts new node, returns UUID
    - `mget` - universal paginated `GET` request, returns normalised graph of requested node + direct relations

## Web Client

- `src/component/primitive/*` contains scopes for reusable generic components
- `src/component/feature/*` contains scopes for specific features
- `component/*/*/element/*.tsx` contains visible element for the scope
- `component/*/*/local/*.tsx` conatins local components for the scope
- `component/*/*/style/*.module.scss` conatins styles for the scope

- i18 is used for internationalisation
- Uses `react-router` in data mode, uses `Lazy Loading` for absolutely no reason and no benefit
- Does not use `SSR`, I tried to make it work with `Lazy Loading` without switching to big framework, but figgured I have to choose one
- `Products` page
    - Displays `Product Nodes` in a paginated virtualised filtered list
    - User can `patch`, `post` or `delete` `Product Nodes`
    - `Product Nodes` display optimistic state
- `Groups` page
    - Displays `Group Nodes` in a paginated virtualised list
    - User can `patch`, `post` or `delete` `Group Nodes`
    - `Group Nodes` display optimistic state
- `Orders` page
    - Displays `Order Nodes` in a paginated virtualised list
    - On `Order` selection, opens side menu with editable virtualised filtered list of `Order Nodes` with controls
    - User can `patch`, `post` or `delete` `Group Nodes`
    - `Order Nodes` display optimistic state

## Notes on implementation

- For styles `.scss`, `@use "util:*"` path is resolved to the top level `./src/style/*`
- Virtualisation of lists, beeing usually a bad idea, was chosen due to the performance implications of slide animation in `Orders` page
- Update of state of inputs does cause rerender. Natural consequence of live-editing (no "save" button), where nodes consume optimistic state

## Some unintuitive terminology

- `primitive/virtual` contains two vertical grid virtualisers `LMonDyn` and `GMonDyn`
    - `Mon` - monotonous, assumes every row is same size
    - `Dyn` - dynamic, infers size from measurements, contrary to size beeing statically calculated
    - `L` - local, expects to be of fixed size and infers render state from scroll
    - `G` - global, expects to not be a scroll container and infers render state from screen position

- `primitive/in-text` - a set of basic text inputs with validation mechanics
    - `Weak` - uses uncontrolled input
    - `Strong` - uses controlled input

- `primitive/stabs` - css for some stable sizing techniques with grids, ended up beeing unused
