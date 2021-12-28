import * as fs from 'fs';
import stream from 'stream'
import sharp from 'sharp';

export const getFile = async (req, res) => {
    try {
        const path = req._parsedUrl.pathname
        const fileRead = fs.createReadStream(`public/${path}`) // or any other way to get a readable stream
        const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
        let transform = sharp()
        //transform.resize(512, 512)
        stream.pipeline(
            fileRead,
        ps, // <---- this makes a trick with stream error handling
        (err) => {
            if (err) {
            console.log(err) // No such file or any other kind of error
            return res.sendStatus(400); 
            }
        })
        //fileRead.pipe(transform).pipe(res)
        ps.pipe(res) // <---- this makes a trick with stream error handling

    } catch (error) {
        console.log(error)
        return res.json({
            error: true,
            message: error
        })
    }
}