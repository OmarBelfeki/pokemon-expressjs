const express = require("express")
const fs = require("fs")

const app = express()
app.use(express.json())

const pokemons_list = JSON.parse(fs.readFileSync("pokemons.json", "utf8"))

const list_pokemons = pokemons_list.reduce((acc, pokemon, index) => {
    acc[index + 1] = pokemon;
    return acc;
}, {});


class Pokemon {
    constructor(id, name, types, total, hp, attack, attack_special, defense, defense_special, speed, evolution_id = null) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.total = total;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.attack_special = attack_special;
        this.defense_special = defense_special;
        this.speed = speed;
        this.evolution_id = evolution_id;
    }
}

app.get("/all_pokemons", (req, res) => {
    res.status(200).send(list_pokemons);
})

app.get("/total_pokemons", (req, res) => {
    res.status(200).send(list_pokemons.length);
})

app.get("/pokemon", (req, res) => {
    const pok = [];
    for(const id in list_pokemons){
        pok.push(new Pokemon(...Object.values(list_pokemons[id])));
    }
    res.status(200).send(pok);
})

app.get("/pokemon/:id", (req, res) => {
    const id = req.params.id;
    if(!list_pokemons[id]) return res.status(404).json( {detail: "Ce pokmeon n'exist pas"} );
    return res.status(200).json(list_pokemons[id]);
});

app.post("/pokemon", (req, res) => {
    console.log(req.body);
    if(req.body.id in list_pokemons) return res.status(400).send("pukatchu exsit");
    pokemons_list.push(req.body);
    return res.status(201).send(req.body);
})

app.put("/pokemon/:id",  (req, res) => {
    const id = req.params.id;
    if(!list_pokemons[id]) return res.status(404).json( {detail: "Ce pokmeon n'exist pas"} );
    console.log(list_pokemons[id]);
    list_pokemons[id] = req.body;
    console.log(list_pokemons[id]);
    return res.status(200).send("changed ok!");
})

app.delete("/pokemon/:id", (req, res) => {
    const id = req.params.id;
    if(!list_pokemons[id]) return res.status(404).json( {detail: "Ce pokmeon n'exist pas"} );
    console.log(list_pokemons[id])
    delete list_pokemons[id]
    console.log(list_pokemons[id])
    return res.status(200).send("removed succ")
})

app.get("/types", (req, res) => {
    const types = new Set();
    for(let i=0; i< pokemons_list.length; i++){
        for(let j=0; j< pokemons_list[i]["types"].length; j++){
            types.add(pokemons_list[i]["types"][j]);
        }
    }
    const stypes = Array.from(types).sort();
    return res.status(200).send(stypes);
})




app.get("/openapi.json", (req, res) => {
  res.json(swaggerDocs);
});


fs.writeFileSync("openapi.json", JSON.stringify(swaggerDocs, null, 2));
console.log("Swagger specification saved to openapi.json");


const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json")

app.use("/api-doc-expressjs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000, () => {console.log("working on port 3000")})
