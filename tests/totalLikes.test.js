// const { test, describe } = require('node:test')
// const assert = require('assert')
// const listHelper =  require('../utils/list_helper')

// describe('total likes', () => {
//     const listWithOneBlog = [
//       {
//         _id: '5a422aa71b54a676234d17f8',
//         title: 'Go To Statement Considered Harmful',
//         author: 'Edsger W. Dijkstra',
//         url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//         likes: 5,
//         __v: 0
//       },
//       {
//         _id: "5a422a851b54a676234d17f7",
//         title: "React patterns",
//         author: "Michael Chan",
//         url: "https://reactpatterns.com/",
//         likes: 7,
//         __v: 0
//       }
//     ]
  
//     test('when list has only one blog, equals the likes of that', () => {
//       const result = listHelper.totalLikes(listWithOneBlog)
//       assert.strictEqual(result, 12)
//     })
//   })