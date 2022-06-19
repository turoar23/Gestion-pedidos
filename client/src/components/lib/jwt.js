export function setJwt(JWToken){
    window.localStorage.setItem('jwtoken', JWToken);
}

export function getJwt() {
    return window.localStorage.getItem('jwtoken');
}

export function removeJwt(){
    window.localStorage.removeItem('jwtoken');
}