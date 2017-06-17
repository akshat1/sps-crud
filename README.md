# Simian Store
Storage component for various Simian servers. It uses the [Cayley graph database](https://cayley.io/), running on top of mongo. This dev version assumes a local mongo instance, but you can change cayley.json if your mongo instance is not on localhost (or if you want to use something other than Mongo; See [Cayley docs](https://github.com/cayleygraph/cayley/blob/v0.6.0/docs/Configuration.md) for possibilities).

- `npm run setup` to do download Cayley binaries, and place them in the working directory.
- `npm run start` to start the cayley server.
- `npm run stop` to stop the running cayley server.
