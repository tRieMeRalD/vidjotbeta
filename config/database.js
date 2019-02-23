if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: "mongodb://tRiwnl:HorizonDank%241234@cluster0-shard-00-00-w81bp.mongodb.net:27017,cluster0-shard-00-01-w81bp.mongodb.net:27017,cluster0-shard-00-02-w81bp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}