let db={
    screams: [
        {
            userhandle: 'user',
            body: 'scream body',
            createdAt: '2019-03-15T11:46:01:018Z',
            likeCount: 5,
            commentCount: 2
        }
    ],

   users:[
       {
           userId: '',
           email:'',
           handle:'',
           createdAt:'',
           imageUrl:'',
           bio:'',
           website:'',
           location:''
       }
   ]
}


const userDetails={
    credentials:{
        userId: '',
        email:'',
        handle:'',
        createdAt:'',
        imageUrl:'',
        bio:'',
        website:'',
        location:''
    },
    likes:[
        {
            userhandle:"",
            screamId:""
        },
        {
            userhandle:"",
            screamId:""
        }
    ]

}
//samo za podsetnik