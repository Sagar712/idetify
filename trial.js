// let str1 = 'ghetle'
// let str2 = 'ghltee'

// function sequence_match(base, test) {

//     base = base.toLowerCase()
//     test = test.toLowerCase()
//     let base_split = base.split('')
//     let test_split = test.split('')
//     let score = 0

//     for (let i = 0; i < base_split.length; i++) {

//         let temp1 = 0.9, temp2 = 0.9, found = false

//         if (test_split[i] != undefined) {
//             if (base_split[i] == test_split[i])
//                 score++
//             else {
//                 for (let k = i - 1; k >= 0; k--) {
//                     if (base_split[k] == test_split[i]) {
//                         found = true
//                         break
//                     }
//                     else{
//                         temp1 = temp1 - 0.3
//                         temp1 = parseFloat(temp1.toFixed(2))
//                     }

//                     if (temp1 < 0)
//                         break
//                 }
//                 if (!found)
//                     temp1 = 0

//                 found = false
//                 for (let k = i + 1; k < base_split.length; k++) {
//                     if (base_split[k] == test_split[i]) {
//                         found = true
//                         break
//                     }
//                     else{
//                         temp2 = temp2 - 0.3
//                         temp2 = parseFloat(temp2.toFixed(2))
//                     }

//                     if (temp2 < 0)
//                         break
//                 }
//                 if (!found)
//                     temp2 = 0

//                 if (temp1 >= temp2)
//                     score = score + temp1
//                 else
//                     score = score + temp2
//             }
//         }
//         else
//             break
//     }

//     //return score
//     return 'sequence match: '+(score/base_split.length).toFixed(2)*100+' %'
//     //console.log(base_split, test_split);
// }

// function similarity(s1, s2) {
//     s1 = s1.toLowerCase();
//     s2 = s2.toLowerCase();

//     let splitBig = s1.split("")
//     let splitSmall = s2.split("")

//     let match_count = 0
//     let reject = []

//     for (let i = 0; i < splitBig.length; i++) {
//         let current = splitBig[i]
//         for (let j = 0; j < splitSmall.length; j++) {
//             let current_2 = splitSmall[j]
//             if (current === current_2 && match_count < splitBig.length && match_count < splitSmall.length && !reject.includes(j)) {
//                 match_count++
//                 reject.push(j)
//                 break
//             }
//         }
//     }

//     let denominator = splitBig.length + splitSmall.length - match_count
//     //console.log("matches: "+match_count," out of: "+denominator);
//     return 'words match: '+(match_count / denominator).toFixed(2)*100+' %'
// }

// console.log(str1+' <-> '+str2);

// console.log(similarity(str1, str2));

// console.log(sequence_match(str1, str2));