const debounce=(func,delay=1000)=>{
    let timeID;
    return(...arguments)=>{
        if(timeID){
            clearInterval(timeID);
        }
        timeID=setTimeout(()=>{
            func(...arguments)
        },delay);
    };
};
