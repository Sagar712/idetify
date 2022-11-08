console.log("Hii");

let str1 = "kapde"
let str2 = "kapadee"

let bigger = str1.length>str2.length ? str1 : str2
let smaller = str1.length<str2.length ? str1 : str2

let splitBig = bigger.split("")
let splitSmall = smaller.split("")
console.log(splitBig,splitSmall);

let match_count = 0
for (let i = 0; i < splitBig.length; i++) {
    let current = splitBig[i]
    for (let j = 0; j < splitSmall.length; j++) {
        let current_2 = splitSmall[j]
        if(current === current_2){
            match_count++
            break
        }
    }
    
}
console.log("Matches:"+ match_count);
console.log("Match percent:"+ match_count,splitBig.length, splitSmall.length);
console.log("Match percent:"+ (match_count/(match_count+(splitBig.length-match_count)+(splitSmall.length-match_count)))*100+ " %");