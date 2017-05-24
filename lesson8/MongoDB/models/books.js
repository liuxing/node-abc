const Book = require('../lib/mongo').Book

module.exports = {
    getBooks(){
        return Book
            .find({})
            .sort({_id: -1})
            .exec()
    },
    getBook(id){
        return Book
            .findById(id)
            .exec()
    },
    editBook(id, data){
        return Book
        .findByIdAndUpdate(id, data)
        .exec()
    },
    addBook(book){
        return Book.create(book)
    },
    delBook(id){
        return Book
            .findByIdAndRemove(id)
            .exec()
    }
}