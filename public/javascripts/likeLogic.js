function likeLiterature(likes, literatureId) {
    if  (document.querySelector('#like-btn').innerHTML.trim()== `<i class="far fa-heart" aria-hidden="true"></i>`) {
        let updatedLikes = likes +1;
        document.querySelector('#likes-count').textContent++;
        document.querySelector('#like-btn').innerHTML= `<i class="fas fa-heart"></i>`;
        axios.put('/literature/' + literatureId + '/like' );
    }
    else if (document.querySelector('#like-btn').innerHTML.trim()== `<i class="fas fa-heart" aria-hidden="true"></i>`) {
        let updatedLikes = likes -1;
        document.querySelector('#likes-count').textContent--;
        document.querySelector('#like-btn').innerHTML= `<i class="far fa-heart"></i>`;
        axios.put('/literature/' + literatureId + '/unlike');
    }
}