const autocompletefunc=({root,renderOpt,optionSelect,inputvalue,FetchData})=>{
    root.innerHTML=`
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;


    const input=root.querySelector("input");
    const dropdown=root.querySelector(".dropdown");
    const resultsWrapper=root.querySelector(".results");

    const searching=async event=>{
        const items=await FetchData(event.target.value);

        if(!items.length){
            dropdown.classList.remove("is-active");
            return
        }
         
        dropdown.classList.add("is-active"); 
        resultsWrapper.innerHTML=""; 
        for (let item of items){
            const opt=document.createElement("a");
            opt.classList.add("dropdown-item");
            opt.innerHTML=renderOpt(item);

            opt.addEventListener("click",()=>{
                dropdown.classList.remove("is-active")
                input.value=inputvalue(item);
                optionSelect (item);
            })

            resultsWrapper.appendChild(opt);
        }
    }

    input.addEventListener("input",debounce(searching));
    document.addEventListener("click",event=>{
        if(!root.contains(event.target)){
            dropdown.classList.remove("is-active"); 
        }
    })
 
}