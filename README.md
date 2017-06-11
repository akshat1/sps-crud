# sps-crud
This is the server component of the Simian Photo Server. It uses the [Cayley graph database](https://cayley.io/), running on top of mongo. This dev version assumes a local mongo instance, but you can change cayley.json if your mongo instance is not on localhost (or if you want to use something other than Mongo; See [Cayley docs](https://github.com/cayleygraph/cayley/blob/v0.6.0/docs/Configuration.md) for possibilities).

SPS-Crud will download Cayley binaries, and place them in the working directory. Execute `npm run setup-cayley` to do this.
