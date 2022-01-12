import React,{Component,Fragment} from 'react'

import withStyles from '@material-ui/core/styles/withStyles'
import { StylesContext } from "@material-ui/styles/StylesProvider";
import MyButton from '../utility/MyButton'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DIalogTitle from '@material-ui/core/DIalogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import {connect} from 'react-redux'
import {deleteScream} from '../redux/actions/dataActions'
import DialogTitle from '@material-ui/core/DIalogTitle';


const styles={
  deleteButton:{
      position: 'absolute',
      top:'10%',
      left:'90%'
    
  }
}
class DeleteScream extends Component{
    state={
        open:false,

    }
    handleOpen=()=>{
        this.setState({
            open:true
        })
    }
    handleClose=()=>{
        this.setState({
            open:false
        })
    }
    deleteScream=()=>{
        this.props.deleteScream(this.props.screamId)
        this.handleClose()
    }
    render(){
        const {classes}=this.props;
        return (
            <Fragment>
                <MyButton tip='Delete Post' onClick={this.handleOpen} btnClassName={classes.deleteButton}>
                    <DeleteOutline color='secondary'/>
                </MyButton>
                <Dialog open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth='sm'>
                    <DialogTitle >
                        Are you sure you wan't to delete this post?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>Cancle</Button>
                        <Button onClick={this.deleteScream} color='primary'>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>


        )
    }
}


DeleteScream.propTypes={
    deleteScream:PropTypes.func.isRequired,
    classes:PropTypes.object.isRequired,
    screamId:PropTypes.string.isRequired
}
export default connect(null,{deleteScream})(withStyles(styles)(DeleteScream))