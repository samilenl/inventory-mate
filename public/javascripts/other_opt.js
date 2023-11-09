const more_options = document.querySelectorAll(".other-opt")
const shows = document.querySelectorAll(".show")

shows.forEach((show, index) => {
    show.addEventListener("click", ()=>{
        more_options[index].style.display = "flex"
    })    
})

window.addEventListener("click", (e)=>{
    e.stopPropagation()
    if (!e.target.closest(".item-card") && !e.target.closest(".delete-modal")){
        more_options.forEach(option => option.style.display = "none")
    }
})