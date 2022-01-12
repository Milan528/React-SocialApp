const functions = require('firebase-functions');

const express=require('express')
const {db}=require('./utility/admin')
const {FBAuth}=require('./utility/fbAuth')


const app=express();

//scream routes

const { getAllScreams,getScream,commentOnScream,likeScream,unlikeScream,deleteScream } = require('./handlers/screams')
const { postOneScream } = require('./handlers/screams')
app.get('/screams',getAllScreams)
app.post('/screams',FBAuth,postOneScream)
app.get('/screams/:screamId',getScream)
app.post('/screams/:screamId/comment',FBAuth,commentOnScream)
app.get('/screams/:screamId/like',FBAuth,likeScream)
app.get('/screams/:screamId/unlike',FBAuth,unlikeScream)
app.delete('/screams/:screamId',FBAuth,deleteScream)

//users route
const {
    singup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
}=require('./handlers/users')

app.post('/singup',singup)
app.post('/login',login)
app.post('/user/image',FBAuth,uploadImage)
app.post('/user',FBAuth,addUserDetails)
app.get('/user',FBAuth,getAuthenticatedUser)
app.get('/user/:handle',getUserDetails)
app.post('/notifications',FBAuth, markNotificationsRead)

//https://baseurl.com/api/nesto
exports.api=functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike=functions.region('europe-west1').firestore.document('likes/{id}')
.onCreate((snapshot)=>{

    return db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc=>{
        if(doc.exists && doc.data().userHandle!==snapshot.data().userHandle) {
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'like',
                read: false,
                screamId: doc.id
            })
        } 
    })
    .catch(error=>{
        console.error(error);
        
    })
})
exports.deleteNotificationOnUnlike=functions.region('europe-west1').firestore.document('likes/{id}')
.onDelete((snapshot)=>{
    return db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch(error=>{
        console.error(error)
       return;
    })
  
})

exports.createNotificationOnComment=functions.region('europe-west1').firestore.document('comments/{id}')
.onCreate((snapshot)=>{
   return db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc=>{
        if(doc.exists) {
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'comment',
                read: false,
                screamId: doc.id
            })
        } 
    })
    .catch(error=>{
        console.error(error);
        return;
    })
})

//kada potencijalno menjamo vise fajla koristimo ovaj batch umesto update
exports.onUserImageChange=functions.region('europe-west1').firestore.document('/users/{userId}')
.onUpdate((change)=>{
    console.log(change.before.data())
    console.log(change.after.data())
    if(change.before.data().imageUrl!==change.after.data().imageUrl)
    {
    console.log("Image has changed")
    let batch=db.batch();
     return db.collection('screams').where("userHandle",'==',change.before.data().handle).get()
    .then(data=>{
        data.forEach(doc=>{
            console.log('Returned scream')
            const scream=db.doc(`/screams/${doc.id}`);
            batch.update(scream,{userImage: change.after.data().imageUrl});
        })
        return batch.commit();
    })
    .catch(error=>{
        console.log(error)
    })
    }else{
        return true;
    }

})

exports.onScreamDelete=functions.region('europe-west1').firestore.document('/screams/{id}')
.onDelete((snapshot,context)=>{
    //context sadrzi parametre iz urla
    const screamId=context.params.id;
    const batch=db.batch();
    console.log(snapshot.data().id)
    console.log(screamId)
    return db.collection('comments').where('screamId','==',screamId).get()
    .then(data=>{
        data.forEach(comment=>{
            const ref=db.doc(`comments/${comment.id}`)
            batch.delete(ref);
        })
        return db.collection('likes').where('screamId','==',screamId).get()
    })
    .then(data=>{
        data.forEach(like=>{
            const ref=db.doc(`likes/${like.id}`)
            batch.delete(ref);
        })
        return db.collection('notifications').where('screamId','==',screamId).get()
    })
    .then(data=>{
        data.forEach(notif=>{
            const ref=db.doc(`notifications/${notif.id}`)
            batch.delete(ref);
        })
        return batch.commit();
    })
    .catch(error=>{
        console.error(error)
    })
})