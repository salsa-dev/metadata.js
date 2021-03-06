import React, {Component, PropTypes} from "react";

import TabsLogin from './TabsLogin';
import User from './TabsUser';

export default class FrmLogin extends Component {


  render() {

    const { props } = this

    if(props.state_user.logged_in && props._obj){
      return < User { ...props } />
    }else{
      return < TabsLogin { ...props } />
    }
  }

}
