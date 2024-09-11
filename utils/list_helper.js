const dummy = (blogs) => {
 return 1
}

const totalLikes = (array) => {
    const likes = []
    array.map(blog => {
        likes.push(blog.likes)
    })
    return likes.reduce((acumulador, valorActual) => acumulador + valorActual);
}

const favoriteBlog = (array) => {
    const objetoConMasLikes = array.reduce((max, obj) => {
        return obj.likes > max.likes ? obj : max;
      }, array[0]); 
 return objetoConMasLikes
}

const mostBlogs = (array) => {

let autores ={}
array.map(blog => {
const autor = blog.author

if(autores[autor]) {
    autores[autor] ++
} else {
    autores[autor] = 1
}
 
})

autores = Object.entries(autores)

let moreBlogs = {}
let max = 0
for(let i = 0; i < autores.length; i++) {
    if(autores[i][1] > max) {
       max =  autores[i][1]
       moreBlogs['author'] = autores[i][0]
       moreBlogs['blogs'] = autores[i][1]

    }
}
if(moreBlogs) {
    return (moreBlogs)
    
}

}

const mostLikes = (array) => {
let max = 0
const moreLikes = {}
for(let i = 0; i < array.length; i++) {
  const blog = array[i]
  if(blog.likes > max) {
    max = blog.likes
    moreLikes['title'] = blog.title
    moreLikes['author'] = blog.author
    moreLikes['likes'] = blog.likes
  }

}
console.log(max)
if(moreLikes) {
    return moreLikes
}

}

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs, 
    mostLikes
}