# Prisma to Ecto Converter

A tool to convert [Prisma](https://www.prisma.io) schema files into [Ecto](https://hexdocs.pm/ecto/Ecto.html) schema files for seamless integration with Elixir Phoenix applications.

## Features

- **Automatic Conversion**: Transforms Prisma schema models to Ecto schema models.
- **Data Type Mapping**: Converts Prisma data types to their Ecto equivalents.
- **Relationship Mapping**: Handles many-to-one, one-to-many, and many-to-many relationships.
- **CLI Support**: Command-line interface for ease of use.

## Installation

Install the package globally via npm:

```bash
npm install -g prisma-to-ecto
```

## Usage

```bash
prisma-to-ecto convert ./prisma/schema.prisma ./ecto
```

## Example:

```bash
prisma-to-ecto convert ./prisma/schema.prisma ./ecto
```


 

## Schema Conversion

Given a Prisma schema file:
```prisma.schema
model User {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}

model Post {
  id      Int    @id @default(autoincrement())
  title   String
  content String
  author  User   @relation(fields: [userId], references: [id])
  userId  Int
}
```

The generated Ecto schema will look like:

```elixir
defmodule MyApp.User do
  use Ecto.Schema

  schema "users" do
    field :name, :string
    has_many :posts, MyApp.Post
  end
end

defmodule MyApp.Post do
  use Ecto.Schema

  schema "posts" do
    field :title, :string
    field :content, :string
    belongs_to :user, MyApp.User
  end
end
```


## Contributing

Feel free to open issues or submit pull requests. Contributions are welcome!


## License
MIT License


