const formDelete = document.querySelector("#form-delete")
formDelete.addEventListener("submit", function(event){
    const confirmation = confirm("Deseja deletar?")
        if(!confirmation){
            event.preventDefault()
        }
})
   