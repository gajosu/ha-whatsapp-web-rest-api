exports.index = (req, res) =>{
    res.sendFile('resources/views/index.html', { root: './' });
}
