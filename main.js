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


    let k = 0, result_str = ''
    let all_ranks = showRanks()
    while (all_ranks[k] != undefined) {
        result_str += create_row(all_ranks[k].category, all_ranks[k]["closest word found"], (all_ranks[k]["match percentage"] * 100).toFixed(2))
        k++
    }

    document.querySelector("#result").innerHTML = `<table> 
    ${create_row('Category', 'Closest word', 'Match', 1)}
    ${result_str}
    </table>`
}

function create_row(a, b, c, spl) {
    if (spl == 1)
        return `<tr> <td> ${a} </td> <td> ${b} </td> <td> ${c} </td> </tr>`
    else
        return `<tr> <td class='special'> ${a} </td> <td class='special'> ${b} </td> <td class='special'> ${c} %</td> </tr>`
}

function fetch_subject_for_query(query) {
    //reading query from input
    let queryParts = query.split(" ")
    console.log(queryParts);
    let current_result = "unknown"
    let last_result = { 'match percentage': 0 }
    ranks = []
    for (let i = 0; i < queryParts.length; i++) {
        let search_result = SearchSubject(queryParts[i])
        let search_result_slang_word = SearchSubject(queryParts[i], 'slang_subjects')

        //Reranking between noraml vs slang words
        if (search_result['match percentage'] < search_result_slang_word['match percentage']) {
            search_result = search_result_slang_word
        }

        if (last_result["match percentage"] < search_result['match percentage']) {
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
    let closest_word = "-"
    let similarity_percent = 0
    let highest_percent = 0
    let current_key = "unknown"
    let probable_key = "unknown"
    //iterating through each category
    for (let j = 0; j < all_keys.length; j++) {
        current_key = all_keys[j];
        let arr = data[dataset][current_key]
        //console.log(arr);
        let rank_percent = 0

        //Iterating through each item of category, if we find higher match percent we add it to reranker service
        for (let i = 0; i < arr.length; i++) {

            similarity_percent = similarity(word, arr[i])

            if (similarity_percent > highest_percent) {
                probable_key = current_key
                closest_word = arr[i]
                highest_percent = similarity_percent
            }
            reranker({
                category: current_key,
                "closest word found": arr[i],
                "match percentage": similarity_percent
            })
        }

    }
    return {
        category: probable_key,
        "closest word found": closest_word,
        "match percentage": highest_percent
    }
}

//Similarity calculation service
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
    return ((match_count / denominator) + sequence_match(s2, s1))/2
}

//Reranker service
function reranker(elem) {
    for (let i = 0; i < ranks.length; i++) {
        if (ranks[i] != undefined && ranks[i + 1] != undefined) {
            if (elem['match percentage'] > ranks[i]['match percentage'] && elem['match percentage'] <= ranks[i + 1]['match percentage']) {
                ranks.splice(i + 1, 0, elem)
                break
            }
        }
        else if (ranks[i] != undefined) {
            if (elem['match percentage'] > ranks[i]['match percentage']) {
                ranks.push(elem)
                break
            }
        }
    }
    if (ranks.length == 0)
        ranks.push(elem)
    if (ranks.length > 5)
        ranks.splice(0, 1)
}

function showRanks() {
    let duplicate = ranks.slice()
    return duplicate.reverse()
}


//Sequence service:
function sequence_match(base, test) {

    base = base.toLowerCase()
    test = test.toLowerCase()
    let base_split = base.split('')
    let test_split = test.split('')
    let score = 0

    for (let i = 0; i < base_split.length; i++) {

        let temp1 = 0.9, temp2 = 0.9, found = false

        if (test_split[i] != undefined) {
            if (base_split[i] == test_split[i])
                score++
            else {
                for (let k = i - 1; k >= 0; k--) {
                    if (base_split[k] == test_split[i]) {
                        found = true
                        break
                    }
                    else{
                        temp1 = temp1 - 0.3
                        temp1 = parseFloat(temp1.toFixed(2))
                    }

                    if (temp1 < 0)
                        break
                }
                if (!found)
                    temp1 = 0

                found = false
                for (let k = i + 1; k < base_split.length; k++) {
                    if (base_split[k] == test_split[i]) {
                        found = true
                        break
                    }
                    else{
                        temp2 = temp2 - 0.3
                        temp2 = parseFloat(temp2.toFixed(2))
                    }

                    if (temp2 < 0)
                        break
                }
                if (!found)
                    temp2 = 0

                if (temp1 >= temp2)
                    score = score + temp1
                else
                    score = score + temp2
            }
        }
        else
            break
    }

    //return score
    return score/base_split.length
    //console.log(base_split, test_split);
}
