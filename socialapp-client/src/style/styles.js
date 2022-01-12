export const style={
    centerText:{
        textAlign:'center'
        
     },
     image:{
       margin:'20px auto 20px auto'
    
     },
     pageTitle:{
        margin:'10px auto 10px auto',
       
        
         
     },
     textField:{
         margin:'10px auto 10px auto'
     },
     button:{
         marginTop:'20px',
         position:'relative'
     },
     customError:{
         color:'red',
         fontSize:'0.8rem'
     },
     progress:{
         position:'absolute'
     },
     paper: {
      padding: 20
    },
    profile: {
      '& .image-wrapper': {
        textAlign: 'center',
        position: 'relative',
        '& button': {
          position: 'absolute',
          top: '80%',
          left: '70%'
        }
      },
      '& .profile-image': {
        width: 200,
        height: 200,
        objectFit: 'cover',
        maxWidth: '100%',
        borderRadius: '50%'
      },
      '& .profile-details': {
        textAlign: 'center',
        '& span, svg': {
          verticalAlign: 'middle'
        },
        '& a': {
          color: '#00bcd4'
        }
      },
      '& hr': {
        border: 'none',
        margin: '0 0 10px 0'
      },
      '& svg.button': {
        '&:hover': {
          cursor: 'pointer'
        }
      }
    },
    buttons: {
      textAlign: 'center',
      '& a': {
        margin: '20px 10px'
      }
    },
    editUserbutton:{
      float:'right'

    },
    submitButton:{
      position:'relative'
    },
    progressSpinner:{
      position:'absolute'
    },
    closeButton:{
      position:'absolute',
      left:'90%',
      top:'10%'
    }
}


