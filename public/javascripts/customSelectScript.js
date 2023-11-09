const selectOptions = document.querySelector('.select-options');
const selectedItemz = document.querySelector('.selectedItems');
const sumbit = document.querySelector('#submit')
const box = document.querySelector('#tag-select')
const form = document.querySelector('.item-form')

    const myValue = document.querySelector(".selecteds").value

    
const selectedTags = []
let temp = selectedItemz.innerText.split(", ")
temp = temp.map(item => item.trim())

console.log(temp)

if (temp.length > 0) {
    selectedTags.push(...temp)
}

console.log("Selected Tags:", selectedTags)
document.querySelector(".selecteds").value = selectedTags.join(", ")

box.addEventListener("change", () => {
 
    if (box.value !== "" && !selectedTags.includes(box.value) && !temp.includes(box.value)){
        if (selectedItemz.innerText) {
            selectedItemz.innerText +=  ", " + box.value
        } 
        else {
            selectedItemz.innerText += box.value
        }

        selectedTags.splice(0)
        selectedTags.push(...selectedItemz.innerText.split(", "))
        console.log(selectedTags)



    }
    else if (selectedTags.includes(box.value) || temp.includes(box.value)) {
        const index = selectedTags.indexOf(box.value)
        const index2 = temp.indexOf(box.value)

        if (index !== -1) {
            selectedTags.splice(index, 1) 
        }
        
        if (index2 !== -1) {
            temp.splice(index2, 1)
        }

        selectedItemz.innerText = temp.join(", ")

    }

    console.log("st:", selectedTags)
    console.log("t", temp)

    console.log(selectedTags.join(", "))
    console.log(box.value)


    if (myValue) {
        const a = myValue.split(", ")
        const newValue = [... new Set([...a, ...selectedTags])]
        console.log(newValue)
        document.querySelector(".selecteds").value = newValue.join(", ")
        console.log("ifffffff",document.querySelector(".selecteds").value)
    }
    else {
        document.querySelector(".selecteds").value = selectedTags.join(", ")
        console.log("elsessss", document.querySelector(".selecteds").value)
    }


})