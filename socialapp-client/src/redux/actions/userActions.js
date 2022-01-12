import {SET_USER,SET_ERRORS,CLEAR_ERRORS,LOADING_UI, SET_UNAUTHENTICATED,LOADING_USER} from '../types'
import axios from 'axios'

export const loginUser=(userData,history)=>(dispatch)=>{
    dispatch({type : LOADING_UI})
    axios.post('/login',userData)
    .then(res=>{
        console.log('Provera tokena')
        console.log(res.data.token)

       
        setAuthHeader(res.data.token)
        dispatch(getUserData())
        dispatch({type: CLEAR_ERRORS})
        history.push('/');//redirect
    })
    .catch(error=>{
       
        dispatch({
            type: SET_ERRORS,
            payload: error.response.data
        })
    })
}



export const singupUser=(userData,history)=>(dispatch)=>{
    dispatch({type : LOADING_UI})
    axios.post('/singup',userData)
    .then(res=>{
        console.log('Provera tokena')
        console.log(res.data.token)

       
        setAuthHeader(res.data.token)
        dispatch(getUserData())
        dispatch({type: CLEAR_ERRORS})
        history.push('/');//redirect
    })
    .catch(error=>{
       
        dispatch({
            type: SET_ERRORS,
            payload: error.response.data
        })
    })
}
export const editUserDetails=(userDetails)=>(dispatch)=>{
    console.log('Recived user details')
    console.log(userDetails)
    dispatch({
        type: LOADING_USER
    })
    
    axios.post('/user',userDetails)
    .then(res=>{
        dispatch(getUserData())
    })
    .catch(error=>console.log(error))
}
export const logoutUser=()=>(dispatch)=>{
   localStorage.removeItem('FBIDToken')
   delete axios.defaults.headers.common['Authorization']
   dispatch({
       type: SET_UNAUTHENTICATED
   })
}
export const getUserData=()=>(dispatch)=>{
    dispatch({
        type:LOADING_USER
    })
    axios.get('/user')
    .then(res=>{
        dispatch({
            type: SET_USER,
            payload: res.data
        })
    })
    .catch(err=>console.log(err))
   

}
export const uploadImage=(formData)=>(dispatch)=>{
    dispatch({
        type:LOADING_USER
    })
    console.log(formData.get('image'))
    axios.post('/user/image',formData)
    .then(res=>{
        dispatch(getUserData())
       
    })
    .catch(error=>console.log(error))
}
const setAuthHeader=(token)=>{
    const FBIdToken=`Bearer ${token}`
        localStorage.setItem('FBIDToken',FBIdToken)
        axios.defaults.headers.common['Authorization']=FBIdToken;
}