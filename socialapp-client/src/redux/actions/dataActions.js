import {SET_SCREAMS,LOADING_DATA,LIKE_SCREAM,UNLIKE_SCREAM,DELETE_SCREAM, LOADING_UI,POST_SCREAM, SET_ERRORS, CLEAR_ERRORS} from '../types'
import axios from 'axios'

export const getScreams=()=>(dispatch)=>{
    dispatch({type:LOADING_DATA})
    axios.get('/screams')
    .then(res=>{
        dispatch({
            type:SET_SCREAMS,
            payload:res.data
        })
    }).catch(error=>{
        dispatch({
            type:SET_SCREAMS,
            payload:[]
        })
        console.log(error)
    })

}

export const likeScream=(screamId)=>(dispatch)=>{
    axios.get(`/screams/${screamId}/like`)
    .then(res=>{
        dispatch({
            type:LIKE_SCREAM,
            payload:res.data
        })
    }).catch(error=>console.log(error))
}

export const unlikeScream=(screamId)=>(dispatch)=>{
    axios.get(`/screams/${screamId}/unlike`)
    .then(res=>{
        dispatch({
            type:UNLIKE_SCREAM,
            payload:res.data
        })
    }).catch(error=>console.log(error))
}

export const deleteScream=(screamId)=>dispatch=>{
    axios.delete(`/screams/${screamId}`)
    .then(()=>{
        console.log('sending dispatch')
        dispatch({
            type:DELETE_SCREAM,
            payload:screamId
        })
    }).catch(error=>console.log(error))

}

export const postScream=(newScream,callback)=>dispatch=>{
    dispatch({
        type:LOADING_UI
    })
    axios.post('/screams',newScream)
    .then(res=>{
        dispatch({
            type:POST_SCREAM,
            payload:res.data
        })
        dispatch({
            type:CLEAR_ERRORS
        })
        

    })
    .then(()=>{
     if(callback!==null && callback instanceof Function)
        callback();
    })
    .catch(error=>{
        dispatch({
            type:SET_ERRORS,
            payload:error.response.data
        })
    })

}
export const clearErrors=()=>(dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS
    })
}