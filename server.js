let express = require('express');
let path = require('path');
let app = express();
app.use(express.static(path.join(__dirname, '/build')))
app.use('/static', express.static(path.join(__dirname, '/build/static')))
app.listen(3031, () => {
	console.log('listen on 3031')
})

/**
 * Created by SMac on 17/8/24.
 */
