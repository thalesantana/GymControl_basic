const fs = require('fs')
const data = require('../data.json')
const { age, date} = require('../utils')
const Intl = require('intl')

//index
exports.index = function(req,res){
    const instructors = data.instructors.map((instructor)=> {
        return{
                ...instructor,
                services: instructor.services.split(",")
            } 
    })
    return res.render("instructors/index",{instructors})       
}

//create
exports.create = function(req,res){
    return res.render("instructors/create")
}

//post
exports.post= function(req,res){
    
        const keys= Object.keys(req.body) // retorna chave de todos vetores
        
        for(key of keys){
            //req.body.key == ""
            if(req.body[key] == ""){ // Verifica se tem campos vazios
                return res.send("Por favor, preencha todos os campos!")
            }
        }
        
        let{avatar_url, birth, name, services, gender} = req.body

        birth = Date.parse(birth)
        const created_at = Date.now()
        const id = Number(data.instructors.length + 2)
        
        data.instructors.push({
            id,
            avatar_url,
            name,
            birth,
            gender,
            services,
            created_at
        })

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write file error!")

            return res.redirect("/instructors")
        })

        //return res.send(req.body)
    }

//Show
    exports.show = function(req,res){
        const{id} = req.params

        const instructors = data.instructors.find(function(instructor){
            return instructor.id == id
        })
        if(!instructors) return res.send("Instructor Not Found")
        

        const instructor = {
            ...instructors,
            age: age(instructors.birth),
            services:instructors.services.split(","),
            created_at: new Intl.DateTimeFormat("pt-BR").format(instructors.created_at),
        }

        return res.render("instructors/show",{instructor})
    }

//edit
exports.edit = function(req,res){
    const{id} = req.params
    const instructors = data.instructors.find(function(instructor){
        return instructor.id == id
    })
    if(!instructors) return res.send("Instructor Not Found")
    
    const instructor = {
        ...instructors,
        birth: date(instructors.birth).iso

    }

    return res.render("instructors/edit",{instructor})
}

// put
exports.put = function(req,res){
    const{id} = req.body
    let index = 0
    const instructors = data.instructors.find(function(instructor, foundIndex){
        if(id == instructor.id) {
            index = foundIndex
            return true
        }
    })
    
    if(!instructors) return res.send("Instructor Not Found")

    const instructor = {
        ... instructors,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }
    
    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`)
    })
}

//delete
exports.delete = function(req,res){
    const {id} = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect('/instructors')
    })
}