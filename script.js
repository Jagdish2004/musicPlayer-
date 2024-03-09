let songs=[];
let currentSong= new Audio();
let firstTime=true;
let currentPlaylist="music";

let play=document.querySelector("#primeplay");


//inner html minicard
async function addPlaylist(song){
    let songList= document.querySelector(".songlist");
    let mcard=document.createElement("div");
    mcard.setAttribute("class","minicard");
    mcard.innerHTML=`<i class="fa-solid fa-music"></i>
    <div>${song.innerText.replaceAll("-"," ")
}</div>
    <i class="fa-regular fa-circle-play"></i>`
    songList.append(mcard);


}

// converting time to proper format
function convertToMinSec(totalSeconds) {
 
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = Math.floor(totalSeconds % 60);

  
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

 
  return minutes + ":" + seconds;
}

//updating the seekbar
function updateSeekaBar(){

  let name=document.querySelector("#songName");
  name.innerText=currentSong.src.split("/").slice(-1)[0].replaceAll("-"," ");

  currentSong.addEventListener("timeupdate",()=>{
    let timer=document.querySelector("#songTimer");
      timer.innerText= convertToMinSec(currentSong.currentTime)+"/"+convertToMinSec(currentSong.duration);
      let seek=document.querySelector(".dot");
         let value=currentSong.currentTime/currentSong.duration*100;
         seek.style.left=value+"%";

     let timeline=document.querySelector(".timeline")
     timeline.addEventListener("click",e=>{
      
       let update=(e.offsetX/e.target.getBoundingClientRect().width)*100;
       seek.style.left=update+"%";
       
       currentSong.currentTime=(update*currentSong.duration)/100;
       
     });
     
   });
}


//playing the song
async function playsong(song){
  currentSong.src=song;
 updateSeekaBar();
    
  currentSong.play(); 
 

}

//reading the card to pass proper info
async function playCardSong(e){
 
  e=e.replaceAll(" ","-");
  setTimeout(function() {
    
     play.setAttribute("class","fa-pause fa-solid");
  }, 100);
   play.setAttribute("class","fa-play fa-solid");

  playsong(currentPlaylist+"/"+e);
}

//loading the songs
 async function getSong(playlist){
     songs=[];
    document.querySelector(".songlist").innerHTML="";
      let a = await fetch(`http://127.0.0.1:3000/WEB%20DEV/spotify-musicPlayer/${playlist}`);
     let response= await a.text();
    let div= document.createElement("div");
    div.innerHTML=response;
   
    let as=div.getElementsByTagName("a");
    for (let i = 0; i < as.length; i++) {
        let element=as[i];
       if(element.href.endsWith(".mp3")){
        songs.push(element.href);
      
        
        await addPlaylist(element);
       }
     
    }
    //eventlister to song mini cards
    Array.from(document.querySelector(".songlist").getElementsByClassName("minicard")).forEach(async e=>{
      e.addEventListener("click",async item =>{
        
      playCardSong(e.getElementsByTagName("div")[0].innerHTML);
      });

    });  
    
    return songs;
}


  
// controlling all the functions from main function
async function main(){
    let songs= await getSong("/music");

    //event listner for updating the playlist
    Array.from(document.querySelector(".cardbox").getElementsByClassName("card")).forEach(async e=>{
      e.addEventListener("click",async item =>{
        currentPlaylist=item.currentTarget.dataset.folder;
        songs=await getSong("/"+item.currentTarget.dataset.folder);
      });

    });


// eventlistner for seekbar to control the song
    play.addEventListener("click" ,function (){
       if(firstTime==true){
        currentSong.src=songs[0];
        
        let name=document.querySelector("#songName");

        updateSeekaBar();
      
        name.innerText="a long way.mp3";
        firstTime=false;
       }


      if(play.getAttribute("class")==="fa-pause fa-solid"){
        play.setAttribute("class","fa-play fa-solid");
        currentSong.pause();

        
      }
      else{
        play.setAttribute("class","fa-pause fa-solid");
        
         currentSong.play();
         let time=document.querySelector("#songTimer");
         currentSong.addEventListener("timeupdate",()=>{
         
         });
         
        
      }
    });
   

//eventlistner for forward and previous key

  let forward=document.querySelector(".fa-forward-step");
  forward.addEventListener("click",()=>{
      currentSong.pause();
      let index=songs.indexOf(currentSong.src);
      if(index+1 < songs.length)playsong(songs[index+1]);
      

  });
  let backward=document.querySelector(".fa-backward-step");
  backward.addEventListener("click",()=>{
      currentSong.pause();
      let index=songs.indexOf(currentSong.src);
      if(index-1 >=0) playsong(songs[index-1]);
      

  });
  //controliing the volume of song 

   document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
     currentSong.volume = parseInt(e.target.value)/100;
   });
  
}

//for responsiveness
function responsive(){
   let menu=document.querySelector("#hamburger");
   let active=false;
   menu.addEventListener("click",()=>{
    if(active==false){
    document.querySelector(".left").style.left="0";
    document.querySelector(".forprew").style.left="230px";
    document.querySelector(".hide1").style.display="none";
    document.querySelector(".hide2").style.display="none";
    active=true;
  }
  else{
    document.querySelector(".left").style.left="-100%";
    document.querySelector(".forprew").style.left="20px";
    document.querySelector(".hide1").style.display="contents";
    document.querySelector(".hide2").style.display="contents";
    active=false;
  }
   })

}
//main calls for function

main();
responsive();