import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
    *{
        margin: 0;
        padding:0;
        box-sizing: border-box;
    }
    html{
        &::-webkit-scrollbar{
            width: 0.5rem;
        }
        &::-webkit-scrollbar-thumb{
            background-color: darkgrey;
        }
        &::-webkit-scrollbar-track {
    background: white;
  }
    }
    body{
        font-family: 'Montserrat', sans-serif;
        width: 100%;
    }
    h2{
        font-size: 3rem;
        font-family: 'Abril Fatface', cursive;
        font-weight: lighter;
        color: #333;
    }
    h3{
        font-size: 1.3rem;
        color: #333;
        padding: 1.5rem 0rem;
    }
    p{
        font-size: 1.2rem;
        line-height: 200%;
        color: #696969;
    }
    a{
        text-decoration: none;
    }
    img{
        display: block;
    }
    input{
        font-weight: bold;
    font-family: "Montserrat", sans-serif;
    }

    
.outer-spacing {
	margin: 1rem;
}

.form-group{
	padding: 0.5rem 0;
}

.fieldset {
  position: relative;
  border: 1px solid #ddd;
  padding: 20px;
}

.fieldset{
    margin-top:1.5rem;
}

.fieldset + .fieldset{
    margin-top:3rem;
}

.fieldset > h1 {
  position: absolute;
  top: 0;
  font-size: 18px;
  line-height: 1;
  margin: -9px 0 0; /* half of font-size */
  background: #fff;
  padding: 0 3px;
}

.flex-between {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
}

.textareaAutosize{
    border:0;
    border-bottom:1px solid rgb(59, 59, 59);
    &:hover{
        border-bottom:1px solid rgb(0, 0, 0);
    }

    &:focus{
        border-bottom:1px solid #3F50BA;
    }
}

.Mui-checked + .MuiFormControlLabel-label{
    color:black;
}

button  * {
    pointer-events:none;
}
.sidebar-menu a{
    color:#fff;
}
.active{
    .MuiListItem-button{
        background:#34aac1;
    }
}

.MuiListItem-button{
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}


.sidebar-menu .MuiListItem-button:hover{
    background:#55c1d6;
}
form{
    padding:0;
    margin:0;
}

.breadcrump-inherit{
    color:#696969
}

.breadcrump-textPrimary{
    color:black
}
.burgerMenu{
    display:none; 
}

.header, .MuiDialog-root{
    z-index:9999!important;
}

//timepicker
.react-datetime-picker__calendar--open,
.react-datetime-picker--open{
    z-index:9999;
}

.react-datepicker-time__caption{
    color:rgb(0,0,0);
    font-weight:bold;
}
.react-datepicker__input-container input{
    padding:10px 15px;
    width:100%;
    color:#3c4858;
    border:1px solid rgba(0,0,0,0.2);
    font-weight:normal;
    border-radius: 5px;
}

.react-datepicker__input-container input:focus{
    border:1px solid rgba(0,0,0,0.8);

}

.react-datepicker{
    display:flex;
    flex-direction:column;
}

.react-datepicker__input-time-container{
    order:1;
    text-align:center;
    padding:1em 0;
    margin:0;
}


.react-datepicker__navigation{
    margin-top:3.3rem;
}

.react-datepicker__month-container{
    order:2;
}

.react-datepicker-popper{
    z-index:9999;
}


@media all and (max-width:959px){

    .burgerMenu{
       display:block; 
    }
    .sidebar-menu{
        transform:translateX(-100%);
        transition:transform 0.3s ease-out;
    }
    .sidebar-menu.open{
        transform:translateX(0%);
    }
}

.p-dialog-center{
    z-index:9999!important;
}

.MuiButton-root{
    min-width:inherit!important;
}

.status-Actif{
    color:#43a047;
}

.status-Inactif{
    color:#e53935;
}

/* dropdown */
.MuiPopover-root{
    z-index:99999!important;
}

/*  Filter */
.filter-content{
    display:flex; 
    flex-wrap:wrap;
    .MuiFormControlLabel-root{
        margin-left:0;
        font-size:1rem;
    }
    .MuiCheckbox-root{
        padding:3px;
    }
    .MuiSvgIcon-root{
       width:0.8em;
       height:0.8em;
    }
    .MuiFormGroup-root{
        flex-direction:row;
        flex-wrap:wrap;
    }
    & > *{
        flex: 1 0 14rem;
        width:100%;
    }
}




@media all and (max-width:320px){
    .open .burgerMenu{
       color:#64bfd6;
    }
}
`

export default GlobalStyles
