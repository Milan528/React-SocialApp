const {admin,db}=require('./admin');

const FBAuth=(req,response,next)=>{
    let idToken;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
    {
         idToken=req.headers.authorization.split('Bearer ')[1];
    }
    else{
        return response.status(403).json({error: "Unauthorized"})
    }
   admin.auth().verifyIdToken(idToken)
   .then(decodedToken=>{
       req.user=decodedToken;
       
       return db.collection('users').where('userId','==',req.user.uid)
       .limit(1)
       .get();
   }).then(data=>{
       req.user.handle=data.docs[0].data().handle;
       req.user.imageUrl=handle=data.docs[0].data().imageUrl;
       return next();
   })
   .catch(error=>{
       console.error("Error while verifying token",error);
       return response.status(403).json(error)
   })

}

module.exports={FBAuth};