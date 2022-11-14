let query = window.location.search
let allItems = new URLSearchParams(query)

console.log(allItems.get('name'));