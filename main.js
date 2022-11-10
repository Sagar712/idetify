let data;
let ranks = []

main();
async function main() {
    await fetch("./subjects.json")
        .then(res => res.json())
        .then(response => {
            data = response
        });

    console.log(data);
}

function Identify_subject() {
    let query = document.querySelector("#query").value
    let result = fetch_subject_for_query(query)
    console.log(result);
    console.log(showRanks());
    document.querySelector("#result").innerHTML = `<table> 
    <tr> <td>Category</td> <td>Closest word</td> <td>Match</td> </tr>
    <tr> <td class='special'>${result.category}</td> <td class='special'>${result["closest word found"]}
        </td> <td class='special'>${(result["match percentage"] * 100).toFixed(2)} %</td> </tr>
    </table>`
    
    result
}

function fetch_subject_for_query(query) {
    //reading query from input
    let queryParts = query.split(" ")
    console.log(queryParts);
    let current_result = "unknown"
    let last_result = {'match percentage':0}
    ranks = []
    for (let i = 0; i < queryParts.length; i++) {
        let search_result = SearchSubject(queryParts[i])
        let search_result_slang_word = SearchSubject(queryParts[i], 'slang_subjects')

        //Reranking between noraml vs slang words
        if (search_result['match percentage'] < search_result_slang_word['match percentage']) {
            search_result = search_result_slang_word
        }

        if(last_result["match percentage"] < search_result['match percentage']){
            last_result = search_result
        }
        //console.log(search_result, typeof (search_result));
        if (search_result.category == "unknown") {
            current_result = last_result
            //`Category: ${search_result.category} | Closest word: ${search_result["closest word found"]} | Match percent: ${(search_result["match percentage"] * 100).toFixed(2)}%`
            continue
        }
        current_result = last_result
        //`Category: ${search_result.category} | Closest word: ${search_result["closest word found"]} | Match percent: ${(search_result["match percentage"] * 100).toFixed(2)}%`
    }
    return current_result
}


// Proper Subject indexing
function SearchSubject(word, dataset = 'proper_subjects') {
    let all_keys = Object.keys(data[dataset])
    let closet_word = "-"
    let similarity_percent = 0
    let highest_percent = 0
    let current_key = "unknown"
    let probable_key = "unknown"
    for (let j = 0; j < all_keys.length; j++) {
        current_key = all_keys[j];
        let arr = data[dataset][current_key]
        //console.log(arr);
        for (let i = 0; i < arr.length; i++) {

            similarity_percent = similarity(word, arr[i])

            if (similarity_percent > highest_percent) {
                probable_key = current_key
                closet_word = arr[i]
                let rank_percent = highest_percent
                highest_percent = similarity_percent
                if (rank_percent < highest_percent)
                    reranker({
                        category: probable_key,
                        "closest word found": closet_word,
                        "match percentage": highest_percent
                    })
            }
            if (word.toLowerCase() === (arr[i].toLowerCase())) {
                return {
                    category: current_key,
                    "closest word found": closet_word,
                    "match percentage": highest_percent
                }
            }
        }

    }
    return {
        category: probable_key,
        "closest word found": closet_word,
        "match percentage": highest_percent
    }
}

//Similarity calculation
function similarity(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let splitBig = s1.split("")
    let splitSmall = s2.split("")

    let match_count = 0
    let reject = []

    for (let i = 0; i < splitBig.length; i++) {
        let current = splitBig[i]
        for (let j = 0; j < splitSmall.length; j++) {
            let current_2 = splitSmall[j]
            if (current === current_2 && match_count < splitBig.length && match_count < splitSmall.length && !reject.includes(j)) {
                match_count++
                reject.push(j)
                break
            }
        }
    }

    let denominator = splitBig.length + splitSmall.length - match_count
    //console.log("matches: "+match_count," out of: "+denominator);
    return (match_count / denominator)
}

function reranker(elem) {
    if (ranks.length == 0)
        ranks.push(elem)
    else{
        if(elem['match percentage'] > ranks[ranks.length-1]['match percentage'])
            ranks.push(elem)
    }
    if (ranks.length > 5)
        ranks.splice(0, 1)
}

function showRanks() {
    let duplicate = ranks.slice()
    return duplicate.reverse()
}

