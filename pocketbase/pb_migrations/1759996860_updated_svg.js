/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2982253014")

  // update collection data
  unmarshal({
    "name": "svg_gallery"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2982253014")

  // update collection data
  unmarshal({
    "name": "svg"
  }, collection)

  return app.save(collection)
})
