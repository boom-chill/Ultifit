import * as fs from 'fs';
import stream from 'stream'

export const getFile = async (req, res) => {
    console.log('get File')
    try {
        const path = req._parsedUrl.pathname
        const r = fs.createReadStream(`public/${path}`) // or any other way to get a readable stream
        const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
        stream.pipeline(
        r,
        ps, // <---- this makes a trick with stream error handling
        (err) => {
            if (err) {
            console.log(err) // No such file or any other kind of error
            return res.sendStatus(400); 
            }
        })
        ps.pipe(res) // <---- this makes a trick with stream error handling
    } catch (error) {
        console.log(error)
        return res.json({
            error: true,
            message: error
        })
    }
}