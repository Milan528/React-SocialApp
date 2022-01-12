import  React,{Component}  from "react";
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import loginimage from '../images/loginimage.jpg'
import Typography  from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button'
import axios from 'axios'
import {Link} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { relative } from "path";
import {style} from '../style/styles'

 //redux
 import {connect} from 'react-redux'
 import {loginUser} from '../redux/actions/userActions'  


export class Login extends Component{
    state={
        email:'',
        password:'',
    }

handleSubmit=(event)=>{
    //ne prikazuje u browseru podatke
    event.preventDefault()
    
    const userData={
        email:this.state.email,
        password:this.state.password
    }
    console.log(userData.password)
    console.log("Ovo su moji podaci")
    console.log(userData.email)
    
   this.props.loginUser(userData,this.props.history)

}

handleChange=(event)=>{
    console.log(event.target.value)
    this.setState({
        [event.target.name]:event.target.value
    })

}
    render(){
        const {classes,UI:{loading,errors}}=this.props;
       // const {errors}=this.state;
       
        return(
            <Grid container >
                <Grid item sm/>
                <Grid item sm className={classes.centerText}>
                    <img src={loginimage} alt='emoji image' className={classes.image}/>
                   
                    <Typography variant="h3" className={classes.pageTitle}>
                    Login
                    </Typography>
                  
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email"
                        helperText={errors.email}
                        error={errors.email ? true:false}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={this.handleChange}
                        fullWidth/>
                        <TextField id="password" name="password" type="password" label="Password"
                        helperText={errors.password}
                        error={errors.password ? true:false}
                        className={classes.textField}
                        value={this.state.password}
                        onChange={this.handleChange}
                        fullWidth/>
                        {errors.general && (
                            <Typography variant='body2' className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type='submit' variant='contained' color='primary'
                        className={classes.button} disabled={loading}>
                        {loading ? <CircularProgress className={classes.progress}/>:'Login' } 
                            
                        </Button>
                        <br />
                        <p>
                        <small>Don't have an account? <Link to='/singup'>Sing up!</Link></small>
                        </p>
                       

                    </form>
                    
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
} 
Login.propTypes={
    classes:PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user:PropTypes.object.isRequired,
    UI:PropTypes.func.isRequired
}
const mapStateToProps=(state)=>({
  user: state.user,
  UI:state.UI
})
const mapActionsToProps={
    loginUser
}
export default connect(mapStateToProps,mapActionsToProps)(withStyles(style)(Login))