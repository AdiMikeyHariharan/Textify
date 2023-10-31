import React , {useState} from 'react'

export default function TextArea(props) {

    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
     }
     const handleClClick = e =>{
        let newtext = '';
        setText(newtext)
     }
    const handleUpClick = (event)=>{
        console.log("Uppercase was clicked ! !")
        let newtext = text.toUpperCase();
        setText(newtext);
    }
    const handleCapClick = (event)=>{
        console.log("Capitalise was clicked ! !")
        setText(titleCase(text))     
    }
    const handleLoClick = (event)=>{
        console.log("Lowercase was clicked ! !")
        let newtext = text.toLowerCase();
        setText(newtext);
    }
    const handleObject = (event)=>{
        console.log("Text-Area was clicked ! !")
        setText(event.target.value)
    }
    const[text,setText] = useState("Enter text here");
  return (
    <>
    <div className = "container"> 
        <h1 style={props.change}>{props.heading}</h1>
        <div className="mb-3" style = {props.change}>
        <label htmlFor="myBox" className="form-label"></label>
        <textarea className="form-control" id="myBox" value = {text} onChange = {handleObject} rows="8"></textarea><br/>
        <button className='btn btn-primary' style={props.change} onClick = {handleLoClick} >Convert to Lowercase</button>{' '}
        <button className='btn btn-primary my-3'  style={props.change} onClick = {handleCapClick} >Capitalise each word</button>{' '}
        <button className='btn btn-primary '  style={props.change} onClick = {handleUpClick} >Convert to UpperCase</button>{' '}
        <button className='btn btn-primary '  style={props.change} onClick = {handleClClick} >Clear Text</button>{' '}
      </div>
    </div>
    <div className="container">
        <h1 style={props.change}>Text Summary</h1>
        <div>
            <p style={props.change}>{text.split(" ").length} words and {text.length} characters</p>
            <p style={props.change}>{0.008 * text.split(" ").length} Minutes Read</p>
        </div>
    </div>
    </>
  )
}
