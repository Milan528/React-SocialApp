//validation
const isEmpty=(string)=>{
    if(string.trim()==='')
       return true;
    else
       return false;
 }
 const isValidEmail=(email)=>{
     const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     if(email.match(emailRegEx)) return true;
     else return false;
 
 
 }
 
 const isValidEmailandPassword=(newUser)=>{
     let errors={};
     if(isEmpty(newUser.email)){
         errors.email="Email must not be empty"
     }else if(!isValidEmail(newUser.email))
     {
         errors.email="Must be a valid email"
     }
 
     if(isEmpty(newUser.password)) errors.password="Must not be empty"
 
     return errors;
 }
 const isValidInput=(newUser)=>{
     let errors={};
 
     errors=isValidEmailandPassword(newUser)
     if(newUser.password!==newUser.confirmPassword) errors.confirmPassword="Passwords must match"
     if(isEmpty(newUser.handle)) errors.handle="Must not be empty"
 
     return errors;
 
 }

 const reduceUserDetails=(data)=>{
     let userDetails={};
     if(!isEmpty(data.bio.trim())) userDetails.bio=data.bio;
     if(!isEmpty(data.webSite.trim()))
     {
         if(data.webSite.trim().substring(0,4) !=='http'){
             userDetails.webSite=`https://${data.webSite.trim()}`
         }
         else{
             userDetails.webSite=data.webSite;
         }
     }
     if(!isEmpty(data.location.trim())) userDetails.location=data.location;

     return userDetails;

 }

 module.exports={isEmpty,isValidEmail,isValidEmailandPassword,isValidInput,reduceUserDetails};