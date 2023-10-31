import React,{useState} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import TextArea from './components/TextArea';
import Alert from './components/Alert';
import About from './components/About';
import { BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  const[alert,setAlert] = useState(null)
  const showAlert = (message,type) =>{
    setAlert({
      msg : message,
      type : type
    })
  }
  const[mode,setMode] = useState('light')
  const[modeStyle,setModeStyle] = useState({
    color : 'black',
  })
  const toggleMode = ()=>{
    if(mode === 'light')
    {
      document.body.style.backgroundColor = '#212529';
      document.body.style.transition = 'all 0.4s';
      setModeStyle({
        color:'white',
        }
      )
      setMode('dark')
      showAlert("Dark Mode Enabled","warning")
    }
    else
    {
      document.body.style.backgroundColor = 'white';
      document.body.style.transition = 'all 1s';
      setModeStyle({
        color:'black'
        }
      )
      setMode('light')
      showAlert("Light Mode Enabled","warning")
    }
  }
  return(
    <>
            <BrowserRouter>
            <Alert alert={alert}></Alert>
            <Navbar title = "Textify" mode = {mode} toggleMode = {toggleMode} toggleBtn = 'bi bi-moon-stars-fill' />
            <Routes>
            <Route  path="/" element={<TextArea heading = "Enter the Text to Analyze" change = {modeStyle}/>}></Route>
            </Routes>
            <Routes>
            <Route  path="/about" element={<About/>}></Route>
            </Routes>
            </BrowserRouter>
            
    </>

)};

export default App;
