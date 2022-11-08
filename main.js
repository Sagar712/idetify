let data;

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
    document.querySelector("#result").innerHTML = result
}

function fetch_subject_for_query(query) {
    //reading query from input
    let queryParts = query.split(" ")
    console.log(queryParts);
    let current_result = "unknown"
    for (let i = 0; i < queryParts.length; i++) {
        const search_result = SearchSubject(queryParts[i])
        console.log(search_result, typeof (search_result));
        if (search_result.category == "unknown") {
            current_result = `Category: ${search_result.category} | Closest word: ${search_result["closest word found"]} | Match percent: ${(search_result["match percentage"] * 100).toFixed(2)}%`
            continue
        }
        else
            return `Category: ${search_result.category} | Closest word: ${search_result["closest word found"]} | Match percent: ${(search_result["match percentage"] * 100).toFixed(2)}%`
    }
    return current_result
}

// Proper Subject indexing
function SearchSubject(word) {
    let all_keys = Object.keys(data['proper_subjects'])
    let closet_word = "-"
    let similarity_percent = 0
    let highest_percent = 0
    for (let j = 0; j < all_keys.length; j++) {
        const current_key = all_keys[j];
        let arr = data['proper_subjects'][current_key]
        //console.log(arr);
        for (let i = 0; i < arr.length; i++) {

            similarity_percent = similarity(word, arr[i])

            if (similarity_percent > highest_percent) {
                closet_word = arr[i]
                highest_percent = similarity_percent
            }
            if (word.toLowerCase().match(arr[i].toLowerCase())) {
                return {
                    category: current_key,
                    "closest word found": closet_word,
                    "match percentage": highest_percent
                }
            }
        }

    }
    return {
        category: "unknown",
        "closest word found": closet_word,
        "match percentage": highest_percent
    }
}

//Similarity calculation
function similarity(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    let bigger = s1.length > s2.length ? s1 : s2
    let smaller = s1.length < s2.length ? s1 : s2
    let splitBig = s1.split("")
    let splitSmall = s2.split("")

    let match_count = 0

    for (let i = 0; i < splitBig.length; i++) {
        let current = splitBig[i]
        for (let j = 0; j < splitSmall.length; j++) {
            let current_2 = splitSmall[j]
            if (current === current_2) {
                match_count++
                break
            }
        }

    }

    return (match_count / (splitBig.length - match_count + splitSmall.length))
}

