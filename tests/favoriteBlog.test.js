// const { test, describe } = require('node:test')
// const assert = require('assert')
// const listHelper =  require('../utils/list_helper')

// describe('blog with more likes', () => { 
//     const listBlogs = [
//         {
//           _id: '5a422aa71b54a676234d17f8',
//           title: 'Go To Statement Considered Harmful',
//           author: 'Edsger W. Dijkstra',
//           url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//           likes: 5,
//           __v: 0
//         },
//         {
//           _id: "5a422a851b54a676234d17f7",
//           title: "React patterns",
//           author: "Michael Chan",
//           url: "https://reactpatterns.com/",
//           likes: 7,
//           __v: 0
//         }
//       ]


//       test('check blogs to find the blog with the most likes', () => {
//         const result = listHelper.favoriteBlog(listBlogs)
//         assert.deepStrictEqual(result, {
//             _id: "5a422a851b54a676234d17f7",
//             title: "React patterns",
//             author: "Michael Chan",
//             url: "https://reactpatterns.com/",
//             likes: 7,
//             __v: 0
//           } )
//       })
// })