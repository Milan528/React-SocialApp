
const {db}=require('../utility/admin')

exports.getAllScreams=(req,response)=>{
    db.collection('screams').orderBy('createdAt','desc').get()
    .then((data)=>{
        let screams=[];
        data.forEach(doc=>{
            screams.push({
            screamId: doc.id,
                ...doc.data()
            });
        });
        return response.json(screams);
    })
    .catch(err=>console.log(err));
}


exports.postOneScream=(req,response)=>{
    if(req.body.body.trim()==='')
    {
        return response.status(400).json({body: "Body must not be empty"})
    }
    const newScream={
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        userImage:req.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    };
 
    db.collection('screams').add(newScream)
    .then(doc=>{
        const responseScream=newScream;
        responseScream.screamId=doc.id;
        response.json(responseScream);
 
    })
    .catch(err=>{
        response.status(500).json({error: err.message});
        console.log(err);
    })
}

exports.getScream=(req,response)=>{
    let screamData={};
    db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc=>{
        if(!doc.exists)
        {
            return response.status(404).json({error:"Scream not found"})
        }
        screamData=doc.data();
        screamData.screamId=doc.id;
        return db.collection('comments').orderBy('createdAt','desc').where('screamId','==',req.params.screamId).get()
    })
    .then(data=>{
        screamData.comments=[];
        data.forEach(comment=>{
            screamData.comments.push(comment.data())
        })
        return response.json(screamData);
    })
    .catch(err=>{
        console.error(err);
        return response.status(500).json({error: err})
    })
}
   
exports.commentOnScream=(req,response)=>{
    if(req.body.body.trim()==="") return response.status(400).json({comment:"Must not be empty"})
    const newComment={
        body:req.body.body,
        screamId:req.params.screamId,
        userHandle:req.user.handle,
        createdAt: new Date().toISOString(),
        userImage:req.user.imageUrl
    };
  db.doc(`screams/${req.params.screamId}`).get()
  .then(doc=>{
      if(!doc.exists) return response.status(404).json("Scream not found")
       return doc.ref.update({commentCount: doc.data().commentCount+1})
     })
  .then(()=>{
    return db.collection('comments').add(newComment)
 })
  .then(()=>{
      return response.json(newComment)
  })
  .catch(err=>{
      console.error(err);
      return response.status(500).json({error:"Something went wrong"});
  })
}


exports.likeScream=(req,response)=>{
    const likeDoc=db.collection('likes').where('userHandle','==',req.user.handle).where('screamId','==',req.params.screamId)
    .limit(1);

    const screamDoc=db.doc(`/screams/${req.params.screamId}`);

    let screamData;

    screamDoc.get()
    .then(doc=>{
        if(doc.exists) 
        {
            screamData=doc.data();
            screamData.screamId=doc.id;
            console.error(doc.id);
            console.log(req.params.screamId);
            return likeDoc.get();
        }
        else
        {
            return response.status(404).json({error:"Scream not found"})
        }
    })
    .then(data=>{
        if(data.empty){
            return db.collection('likes').add({
                screamId:req.params.screamId,
                userHandle:req.user.handle
            })
            .then(()=>{
                screamData.likeCount++
                return screamDoc.update({likeCount:screamData.likeCount})
            })
            .then(()=>{
                return response.json(screamData)
            })
        }
        else{
            return response.status(400).json({error:"Already liked"})
        }
    })
    .catch(error=>{
        console.error(error)
        response.status(500).json({error:error.code})
    })
    

}

exports.unlikeScream=(req,response)=>{
    const likeDoc=db.collection('likes').where('userHandle','==',req.user.handle).where('screamId','==',req.params.screamId)
    .limit(1);

    const screamDoc=db.doc(`/screams/${req.params.screamId}`);

    let screamData;

    screamDoc.get()
    .then(doc=>{
        if(doc.exists) 
        {
            screamData=doc.data();
            screamData.screamId=doc.id;
            return likeDoc.get();
        }
        else
        {
            return response.status(404).json({error:"Scream not found"})
        }
    })
    .then(data=>{
        if(data.empty){
            return response.status(400).json({error:"Not liked"})
            
        }
        else{
           return db.doc(`/likes/${data.docs[0].id}`).delete()
           .then(()=>{
               screamData.likeCount--;
               return screamDoc.update({likeCount:screamData.likeCount})
           })
           .then(()=>{
               return response.json(screamData);
           })
           
        }
    })
    .catch(error=>{
        console.error(error)
        response.status(500).json({error:error.code})
    })

}
exports.deleteScream=(req,response)=>{
    //sa refferencm ovako je moglo i za comment al on je zaboravio ovako je mnogo lakse

    const document=db.doc(`/screams/${req.params.screamId}`);

    document.get().then(doc=>{
        if(!doc.exists)
        {
            return response.status(404).json({error:"Not found"})
            
        }
        if(doc.data().userHandle!==req.user.handle)
        {
            return response.status(403).json({error:"Unauthorized"})

        }
        else{
            return document.delete();
        }
    })
    .then(()=>{
        return response.json({message:"Scream deleted"})
    })
    .catch(err=>{
        console.error(err);
        return response.status(500).json({error:err.code})
    })

}