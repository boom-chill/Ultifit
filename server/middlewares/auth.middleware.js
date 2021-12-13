import jwt from 'jsonwebtoken'

export const authenToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    //Bearer [Token]
    let token = authorizationHeader
    if(authorizationHeader != undefined)
        token = token.split(' ')[1]
    
    if(!token) res.status(401).json({message: '[auth.middleware] accessToken mất tiêu'})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err) res.status(403).json({message: '[auth.middleware] accessToken bị sai'})
        next()
    })
}