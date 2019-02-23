if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: "mongodb+srv://tRiwnl:HorizonDank%241234@cluster0-w81bp.mongodb.net/test?retryWrites=true"}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}