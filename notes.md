## DB, Postgres & Prisma

### initialize the database

```bash
npx prisma init --datasource-provider postgresql
```

### migrate the schema

```bash
npx prisma migrate dev --name init
``
```

### Inspect DB

1. enter the Docker container shell:

```bash
docker exec -it <container_name> psql -U <username> -d <database_name>
```

2. Some stuffs for psql

List all databases: `\l`

Connect to a specific database: `\c <database_name>`

List all tables in the current database: `\dt`

Describe a specific table: `\d <table_name>` (like `\dt "User"`)

Show the columns of a table:

```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = '<table_name>';
```

View the first few rows of a table:

```sql
SELECT * FROM <table_name> LIMIT 5;
```

Count the number of rows in a table:

```sql
SELECT COUNT(*) FROM <table_name>;
```

Find the maximum value of a column in a table:

```sql
SELECT MAX(<column_name>) FROM <table_name>;
```

Find the minimum value of a column in a table:

```sql
SELECT MIN(<column_name>) FROM <table_name>;
```

Find the average value of a column in a table:

```sql
SELECT AVG(<column_name>) FROM <table_name>;
```
