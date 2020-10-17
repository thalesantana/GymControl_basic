const fs = require('fs')
const data = require('../data.json')
const { date} = require('../utils')


//index
exports.index = function(req,res){
    const members = data.members.map((member)=> {
        return{
                ...member,
                interests: member.interests.split(",")
            } 
    })
    return res.render("members/index",{members})       
}

//create
exports.create = function(req,res){
    return res.render("members/create")
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
        
        birth = Date.parse(req.body.birth)
        
        let id = 1
        const lastMember = data.members[data.members.length - 1]

        if(lastMember){
            id = lastMember.id +1
        }
        
        
        data.members.push({
            id,
            ...req.body,
            birth
        })

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write file error!")

            return res.redirect(`/members/${id}`)
        })
    }

//Show
    exports.show = function(req,res){
        const{id} = req.params

        const foundMember = data.members.find(function(member){
            return member.id == id
        })
        if(!foundMember) return res.send("member Not Found")
        

        const member = {
            ...foundMember,
            interests:foundMember.interests.split(","),
            birth: date(foundMember.birth).birthDay
        }

        return res.render("members/show",{member})
    }

//edit

exports.edit = function(req,res){
    const{id} = req.params
    const members = data.members.find(function(member){
        return member.id == id
    })
    if(!members) return res.send("member Not Found")
    
    const member = {
        ...members,
        birth: date(members.birth).iso

    }

    return res.render("members/edit",{member})
}

// put
exports.put = function(req,res){
    const{id} = req.body
    let index = 0
    const members = data.members.find(function(member, foundIndex){
        if(id == member.id) {
            index = foundIndex
            return true
        }
    })
    
    if(!members) return res.send("member Not Found")

    const member = {
        ... members,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }
    
    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/members/${id}`)
    })
}

//delete
exports.delete = function(req,res){
    const {id} = req.body

    const filteredmembers = data.members.filter(function(member){
        return member.id != id
    })

    data.members = filteredmembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!")

        return res.redirect('/members')
    })
}