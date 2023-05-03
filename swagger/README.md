## About
Build separated swagger yaml to `swagger\swagger.yaml`
## Watch && auto build
`yarn start`

You can also use `yarn build` to build the yaml file after modifying the files.

## Source tree
- main: `swagger\src\index.yaml`
- modules: `swagger\src\<module_name>_api.yaml`
- schemas: `swagger\src\schemas\*.yaml`

When add a new module, please define yaml in `src\<module_name>_api.yaml`.

## Swagger UI && API Mock
- Start: `docker-compose up` or `docker-compose up -d`
- Stop: `docker-compose down`
  
### Swagger API Mock Server
You can use Swagger API Mock by accessing the [http://localhost:50001](http://localhost:50001) from your browser

### Swagger API Mock
You can check Swagger UI by accessing the [http://localhost:50000](http://localhost:50000) from your browser

You alse can try api use API mock server in Swagger UI page.

