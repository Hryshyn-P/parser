# Parser
```bash
- Node ver: v18.15.0
- NPM ver: v7.24.2
- DB PostgreSQL: v14.7
----------------
```
## Description
```bash
- Node.js app for parsing files and bulk upsert data in database

- When the application starts, it will automatically parse
a txt default file alonge path: ./parser/parsing-files/txt with name export.txt
```
----------------
## API
```bash
- The API on local run is available at the following address: http://localhost:3000

- Upload file, txt, csv, json, form-data with key 'file': POST /upload
- Parse main file -> export.txt:                          POST /parse
- Bulk upsert data in database from -> export.txt:        POST /bulk-upsert
- Bulk upsert data in database from latest file:          POST /bulk-upsert-latest
- Get employees with many donations:                      GET /employees/donations
- Get calculated rewards:                                 GET /employees/calculate-rewards-funds
- Get calculated salaries details by departments:         GET /departments/salary-details
```
## Commands
```bash
- Install dependencies: npm install
- Run dev:   npm run start:dev
- Build app: npm run build
- Run app:   npm run start
- Run tests: npm run test
```
## Config (.env example)
```bash
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_DB=paresr
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432
```
