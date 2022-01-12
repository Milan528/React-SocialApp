import  React,{Component}  from "react";
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import loginimage from '../images/loginimage.jpg'
import Typography  from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button'

import {Link} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { relative } from "path";
import {style} from '../style/styles'


 //redux
 import {connect} from 'react-redux'
 import {singupUser} from '../redux/actions/userActions'




export class Singup extends Component{
    state={
        email:'',
        password:'',
        confirmPassword:'',
        handle:''
       
     

    }
    
handleSubmit=(event)=>{
    //ne prikazuje u browseru podatke
    event.preventDefault()
    this.setState({
        loading:true
    })
    const userData={
        email:this.state.email,
        password:this.state.password,
        confirmPassword:this.state.confirmPassword,
        handle:this.state.handle
    }
    console.log("Ovo su moji podaci")
    console.log(userData.password)
    console.log(userData.confirmPassword)
    console.log(userData.handle)
    console.log(userData.email)
    
    this.props.singupUser(userData,this.props.history)

}

handleChange=(event)=>{
    console.log(event.target.value)
    this.setState({
        [event.target.name]:event.target.value
    })

}
    render(){
        const {classes,UI:{loading,errors}}=this.props;
        //const {errors,loading}=this.state;
        
        return(
            <Grid container >
                <Grid item sm/>
                <Grid item sm className={classes.centerText}>
                    <img src={loginimage} alt='emoji image' className={classes.image}/>
                   
                    <Typography variant="h3" className={classes.pageTitle}>
                    Singup
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
                         <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password"
                        helperText={errors.confirmPassword}
                        error={errors.confirmPassword ? true:false}
                        className={classes.textField}
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        fullWidth/>
                         <TextField id="handle" name="handle" type="text" label="Handle"
                        helperText={errors.handle}
                        error={errors.handle ? true:false}
                        className={classes.textField}
                        value={this.state.handle}
                        onChange={this.handleChange}
                        fullWidth/>
                        {errors.general && (
                            <Typography variant='body2' className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type='submit' variant='contained' color='primary'
                        className={classes.button} disabled={loading}>
                        {loading ? <CircularProgress className={classes.progress}/>:'Singup' } 
                            
                        </Button>
                        <br />
                        <p>
                        <small>Already have an account? <Link to='/login'>Login!</Link></small>
                        </p>
                       

                    </form>
                    
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
} 
Singup.propTypes={
    classes:PropTypes.object.isRequired,
    user:PropTypes.object.isRequired,
    UI:PropTypes.object.isRequired,
    singupUser:PropTypes.func.isRequired
}


const mapStateToProps=(state)=>({
    user:state.user,
    UI:state.UI
})
export default connect(mapStateToProps,{singupUser})(withStyles(style)(Singup))