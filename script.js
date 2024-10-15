console.log("hello world")

let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00';
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3002/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // return songs
    
    // show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                                                <div class="info">
                                                <div> ${song.replaceAll("%20", " ")}</div>
                                                <div>Asad</div>
                                                </div>
                                                <div class="playnow">
                                                  <span>Play Now</span>
                                                  <img class="invert" src="img/play.svg" alt="">
                                                  </div></li>`;
                                                }
                                                
                                                // Attack an event listener to each song
                                                Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=> {
                                                    e.addEventListener("click", element=> {
                                                        // console.log(e.querySelector(".info").firstElementChild.innerHTML)
                                                        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
             })
        })
            return songs           
}

const playMusic = (track, pause=false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track
    if(!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


    //display all the albums on the page
    async function displayalbums(){
        let a = await fetch(`http://127.0.0.1:3002/songs/`)
        let response = await a.text();
        let div = document.createElement("div")
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a")
        let cardcontainer = document.querySelector(".cardcontainer")
        let array = Array.from (anchors)
            for (let index = 0; index < array.length; index++) {
                const e = array[index];
                
            
            if(e.href.includes("/songs")){
                let folder = (e.href.split("/").slice(-2)[0])
                //Get the metadata of the folder
                let a = await fetch(`http://127.0.0.1:3002/songs/${folder}/info.json`)
                let response = await a.json();
                console.log(response)
                cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}"  class="card">
                <div class="play">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://hugeicons.storage.googleapis.com/icons/play-stroke-rounded.svg?type=svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#000000" stroke-width="1.5" fill="#000" ></path>
                  </svg>
                </div>
                  <img src="/songs/${folder}/cover.jpeg" alt="">
                  <h2>${response.title}</h2>
                  <p>${response.description}</p>
              </div>`
            }
        }

            // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=> {
        e.addEventListener("click", async item=> {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])
        })
    })
}
    

async function main() {
    // Get the list of all the songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    await displayalbums()


    play.addEventListener("click", ()=> {
        if(currentsong.paused){
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
            }
    })

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = 
        `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.
        duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=> {
        let percent =  (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration *percent) / 100;
    })

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "0";
    })
    //// add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "-120%";
    })

    //add event to pre and next
    previous.addEventListener("click", ()=> {
        console.log("previous clicked")
        // console.log(currentsong)
        let index = songs.indexOf(  currentsong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })
    
    //add event to pre and next
    next.addEventListener("click", ()=> {
        currentsong.pause()
        console.log("next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })

    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100;
        if(currentsong.volume > 0) {
            document.querySelector(".volume>img").src =  document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // add event listener to mute
    document.querySelector(".volume>img").addEventListener("click", e=> { 
        if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
    })

}


main()