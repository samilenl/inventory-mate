const modals = document.querySelectorAll(".delete-modal")

const buttons = document.querySelectorAll(".delete-btn")

const cancels = document.querySelectorAll(".cancel")

buttons.forEach((button, index) => {
    button.addEventListener("click", (e)=>{
    console.log(e.target)
    modals[index].showModal()
})})

cancels.forEach((cancel, index) => {
    cancel.addEventListener("click", ()=>{
        modals[index].close()
})})

const des = document.querySelector(".des")
const desModal = document.querySelector(".des-modal")
const close =  document.querySelector(".close")

des.addEventListener("click", ()=>{
    desModal.showModal()
})

close.addEventListener("click", (e)=>{
    e.preventDefault()
    desModal.close()
})