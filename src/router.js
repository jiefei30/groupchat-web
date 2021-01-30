/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Room from './components/Room'

Vue.use(Router) 

export default new Router({
    routes:[
        {
            path:'/',
            redirect:'/room'
        },
		{
		    path:'/room',
		    component:Room
		}
    ]
})