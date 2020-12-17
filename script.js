class Photo {
    constructor(id, author, width, height, url, download_url){
        this.id = id;
        this.author = author;
        this.width = width;
        this.height = height;
        this.url = url;
        this.download_url = download_url;
    }
}

const SLIDER_WIDTH = 3;
const MAX_PHOTOS = 5;
const ALL_PHOTOS = 'allPhotos';

var subPicsContainer = document.querySelector("#subPicturesContainer");
var currentPicture = document.querySelector("#mainPicture");


fetchInitialPhotos = async () => {
    let response = await fetch('https://picsum.photos/v2/list?page=2&limit=100');
    let photos = await response.json();
    return photos;
}

savePhotos = (photos) => {
    if(localStorage.getItem(ALL_PHOTOS) === null){
        localStorage.setItem(ALL_PHOTOS, JSON.stringify(photos));
    }
}

extractPhotos = (photos, amount) => {
    thumbsArr = [];
    for(let i = 0; i < amount; i++){
        let photo = new Photo(photos[i].id, photos[i].author, photos[i].width, 
            photos[i].height, photos[i].url,photos[i].download_url)
        thumbsArr.push(photo);
    }

    return thumbsArr;
}


onStart = async () => {
    const mainPicRef = document.querySelector("#mainPicture");
    const authorNameRef = document.querySelector("#authorName");

    let thumbsArr = {};

    // Nothing in cache, we must fetch from the public API
    if(localStorage.getItem(ALL_PHOTOS) === null){
        await fetchInitialPhotos().then(photosData => {
            savePhotos(photosData);
            thumbsArr = extractPhotos(photosData, MAX_PHOTOS);
            });
    }
    else{
        thumbsArr = extractPhotos(JSON.parse(localStorage.getItem(ALL_PHOTOS)), MAX_PHOTOS);
    }


    
    for(let i = 0; i < subPicsContainer.children.length; i++)
    {
        subPicsContainer.children[i].src = thumbsArr[i].download_url;
        subPicsContainer.children[i].addEventListener("click", () => {
            mainPicRef.src = thumbsArr[i].download_url;
            authorNameRef.innerText = thumbsArr[i].author;
        });
    }
    
    mainPicRef.src = thumbsArr[SLIDER_WIDTH - 1].download_url;
    authorNameRef.innerText = thumbsArr[SLIDER_WIDTH - 1].author;

    document.querySelector("#leftArrow").addEventListener("click", () => {
        let tmp = thumbsArr[0];
        for(let i = 0; i < thumbsArr.length - 1; i++) {
            thumbsArr[i] = thumbsArr[i+1];
        }
        thumbsArr[thumbsArr.length - 1] = tmp;

        applyOnDom();
    })

    document.querySelector("#rightArrow").addEventListener("click", () => {
        let tmp = thumbsArr[thumbsArr.length - 1];
        for(let i = thumbsArr.length - 1; i > 0; i--) {
            thumbsArr[i] = thumbsArr[i-1];
        }
        thumbsArr[0] = tmp;

        applyOnDom();
    })

    applyOnDom = () => {
        let slider = document.getElementById('subPicturesContainer');
        for(let i = 0; i < SLIDER_WIDTH; i++) {
            slider.getElementsByTagName('img')[i].src = thumbsArr[i].download_url;  
        }
    }
}

onStart();
