let arr = []
reranker(30)
reranker(40)
reranker(900)
reranker(00)
reranker(90)
reranker(99)


function reranker(elem) {
    arr.push(elem)
    if(arr.length>5)
        arr.splice(0,1)
}

function showRanks() {
    let duplicate = arr.slice()
    
    return duplicate.reverse()
}



//reranker(99)

console.log(arr, showRanks());