const addBtn = document.querySelector(".add")
const md = document.querySelector("#mD")

addBtn.addEventListener("click", () => {
    md.style.display = "flex"
    md.show()
})


window.addEventListener("click", (e) => {
    console.log(e.target.closest("#mD"))
    if (!e.target.closest("#mD") && !e.target.closest(".add")){
        md.style.display = "none"
        md.close()
    }
})