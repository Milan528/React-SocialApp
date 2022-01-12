const {admin,db}=require('../utility/admin')
const {firebaseConfig}=require('../utility/firebaseConfig')
const {isValidEmailandPassword,isValidInput,reduceUserDetails}=require('../utility/userValidations')

const {firebase}=require('../utility/admin')

exports.singup=(req,response)=>{
    const newUser={
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,

    }
    let errors=isValidInput(newUser);
    if(Object.keys(errors).length>0) return response.status(400).json(errors)
    const noImage='no-image.png'


    let token,userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc=>{
        if(doc.exists)
        {
            return response.status(400).json({
                handle: 'this handle is already taken'
            })
        }
        else
        {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
        }
    }).then(data=>{
        userId=data.user.uid;
        return data.user.getIdToken();
    }).then(Idtoken=>{
        token=Idtoken;
        //ovaj token korisnik kasnije koristi da pokupi jos podatke
        const userCredentials={
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl:`https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`,
            userId: userId
        }
        db.doc(`/users/${newUser.handle}`).set(userCredentials);
        return response.status(201).json({token})
    })
    .catch(err=>{
        if(err.code==="auth/email-already-in-use")
        {
            return response.status(400).json({email: "Email already in use"})
        }
        else
        {
            return response.status(500).json({general:"Something wen't wront please try again."})
        }
     })
    
}


exports.login=(req,response)=>{
    const user={
        email: req.body.email,
        password: req.body.password
    }
    console.log(user.email)
    console.log(user.password)
    let errors=isValidEmailandPassword(user)
    if(Object.keys(errors).length>0) return response.status(400).json(errors);
 
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data=>{
        return data.user.getIdToken()
    })
    .then(token=>{
        return response.json({token})
    })
    .catch(error=>{
       
         return response.status(400).json({general: "Wrong crediterials, please try again"});
        
    })
} 


//add user details
exports.addUserDetails=(req,response)=>{
    let userDetails=reduceUserDetails(req.body);
    db.doc(`users/${req.user.handle}`).update(userDetails)
    .then(()=>{
        return response.json({message:"Details added"})
    })
    .catch(err=>{
        console.error(err);
        return response.status(500).json({error:err});
    })
    

}


exports.getAuthenticatedUser=(req,response)=>{
    let userData={}
    db.doc(`/users/${req.user.handle}`).get()
    .then(doc=>{
        if(doc.exists)
        {
            userData.credentials=doc.data();
           
            return db.collection('likes').where('userHandle','==',req.user.handle).get();
        }
     }).then(data=>{
         userData.likes=[];
         data.forEach(doc=>{
             userData.likes.push(doc.data())

         })
         return db.collection(`/notifications`).where('recipient','==',userData.credentials.handle)
         .orderBy('createdAt','desc').limit(10).get();
     })
     .then(data=>{
         userData.notifications=[];
         data.forEach(notification=>{
             userData.notifications.push({
                notificationId: notification.id,
               ...notification.data()
             })
         })
         return response.json(userData)
     })
     .catch(err=>{
         console.error(err);
         return response.status(500).json({error:err})
     })
}
exports.uploadImage=(req,response)=>{
    const BusBoy=require('busboy');
    const path=require('path');
    const os=require('os');
    const fs=require('fs');

    const busboy=new BusBoy({headers:req.headers})
    let imageFileName;
    let imageToBeUploaded={};

    busboy.on('file',(fieldName,file,fileName,encoding,mimetype)=>{
        console.log(fieldName)
        console.log(fileName)
        console.log(mimetype)
        if(mimetype!=='image/jpeg' && mimetype!=='image/png')
        {
            return response.status(400).json({error: "Imsert an jpeg or png image"})
        }

        const imageExtension=fileName.split('.')[fileName.split('.').length-1];
        imageFileName= `${Math.round(Math.random()*100000000000)}.${imageExtension}`;

        const filepath=path.join(os.tmpdir(),imageFileName);
        imageToBeUploaded={filepath,mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });
        busboy.on('finish',()=>{
            admin.storage().bucket().upload(imageToBeUploaded.filepath,{
                resumable: false,
                metadata:{
                    metadata:{
                    contentType:imageToBeUploaded.mimetype
                    }
                }
            }
        ).then(()=>{
            const imageUrl=`https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({imageUrl})

        }).then(()=>{
            return response.json({message: "Image was uploaded"})
        }).catch(error=>{
            console.error(error);
            return response.status(500).json(error)
        })


    })
    busboy.end(req.rawBody)
}
exports.getUserDetails=(req,response)=>{
    let userData={};
    db.doc(`/users/${req.params.handle}`).get()
    .then(doc=>{
        if(doc.exists)
        {
            userData.user=doc.data()
            console.log(doc.id)
            console.log(userData.user.handle)
            console.log(req.params.handle)

            return db.collection('screams').where('userHandle','==',req.params.handle)
            .orderBy('createdAt','desc').get()
        }
        else{
            return response.status(404).json({message:"Not found"})
        }
        
    })
    .then(data=>{
        userData.screams=[];
        data.forEach(post=>{
            userData.screams.push({
                screamId:post.id,
                ...post.data()
            })
        })

        return response.json(userData)
    })
    .catch(error=>{
        console.error(error)
        return response.status(500).json({error:error.code})
    })

}
exports.markNotificationsRead=(req,response)=>{
   //radim neki batch write posto update vise dokumenta
   let batch=db.batch();
   req.body.forEach(notificationId=>{
       const notification=db.doc(`/notifications/${notificationId}`);
       batch.update(notification,{
           read:true
       })
   })
   batch.commit()
   .then(()=>{
       return response.json({notifications:"Marked notifications"})
   })
   .catch(err=>{
       console.error(error)
       return response.status(500).json({error:error.code})
   })
}
