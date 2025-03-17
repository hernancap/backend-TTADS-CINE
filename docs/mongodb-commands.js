
//insert
db.movies.insertOne({
  name: 'Inception',
  genre: 'Science Fiction',
  duration: 148,
  director: 'Christopher Nolan',
  actors: [
    'Leonardo DiCaprio',
    'Joseph Gordon-Levitt',
    'Ellen Page',
    'Tom Hardy'
  ]
})


db.movies.insertOne({
  name: 'The Matrix',
  genre: 'Action, Science Fiction',
  duration: 136,
  director: 'Lana Wachowski, Lilly Wachowski',
  actors: [
    'Keanu Reeves',
    'Laurence Fishburne',
    'Carrie-Anne Moss',
    'Hugo Weaving'
  ]
})

  
  db.movies.find()
  