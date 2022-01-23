const autocompleteconfig={
    renderOpt(movie){
        const imglink=movie.Poster==="N/A"? "":movie.Poster;
        return `
            <img src="${imglink}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputvalue(movie){
        return movie.Title;
    },
    async FetchData(searchterm){
        const response= await axios.get("http://www.omdbapi.com/",{
            params:{
                apikey:"76ec1b60",
                s:searchterm,
            }
        });
        if (response.data.Error){ 
            return [];
        }
        return response.data.Search;
    }, 
};

autocompletefunc({
    ...autocompleteconfig,
    root:document.querySelector("#left-autocomplete"),
    optionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        movieSelect(movie,document.querySelector("#left-summary"),"left");
    },
});

autocompletefunc({
    ...autocompleteconfig,
    root:document.querySelector("#right-autocomplete"),
    optionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        movieSelect(movie,document.querySelector("#right-summary"),"right");
    },
});

let leftmovie;
let rightmovie;

const movieSelect=async (movie,summaryTarget,side)=>{
    const response= await axios.get("http://www.omdbapi.com/",{
        params:{
            apikey:"76ec1b60",
            i:movie.imdbID,
        }
    });
    summaryTarget.innerHTML=movietemplate(response.data);
    
    if(side==="left"){
        leftmovie=response.data;
    }else{
        rightmovie =response.data;
    }

    if(leftmovie && rightmovie){
        comparison();
    }
}

const comparison=()=>{
    const leftsideStat=document.querySelectorAll("#left-summary .notification");
    const rightsideStat=document.querySelectorAll("#right-summary .notification");

    leftsideStat.forEach((leftStat,index)=>{
        let rightStat=rightsideStat[index];

        let leftvalue=parseFloat(leftStat.dataset.value);
        let rightvalue=parseFloat(rightStat.dataset.value);

        console.log(leftvalue,rightvalue);
        
        if(leftvalue>rightvalue){
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }else{
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        }
    });
};


const movietemplate=(movieDetails)=>{
    const revenue=parseInt(movieDetails.BoxOffice.replace(/\$/g,"").replace(/,/g,""));
    const score=parseInt(movieDetails.Metascore);
    const rating=parseFloat(movieDetails.imdbRating);
    const votes=parseInt(movieDetails.imdbVotes.replace(/,/g,""));
 
    const awards=movieDetails.Awards.split(" ").reduce((acv,currentvalue) => {
        let value=parseInt(currentvalue);

        if(isNaN(value)){
            return acv;
        }else{
            return acv+value;
        }
    },0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="img">
                    <img src="${movieDetails.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p> 
        </article>
        <article data-value=${revenue} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box office</p> 
        </article>
        <article data-value=${score} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p> 
        </article>
        <article data-value=${rating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p> 
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p> 
        </article>
    `;
} 