console.log(global);

setTimeout(() => {
    console.log("In The Timeout");
    clearInterval(int)
}
,3001)

const int = setInterval(() =>{
    console.log("In the Interval")
},300)

console.log(__dirname);
console.log(__filename);