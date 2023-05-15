const express = require('express')
const uuid = require("uuid")
const port = 3000;


const app = express()
//para acessar precisa colocar no ar esse sevidor: terminal > node index.js 
//para acessar precisa colocar no ar esse sevidor com nodemon: terminal > npm run dev
//--------------------------------------------------------------------------------------------------------------------------------------------------
/*
app.get('/users', (request, response) => {
    //AULA: O QUE E REQUEST E RESPONSE NA PRATICA
    // http://localhost:3000/users
    console.log(request)//pedidos do front ouu e o pedindo que um cliente realiza a nosso servidor, com dados descrevendo o que o cliente precisa oou resposta do servidor e um emanharado de arquivos ouu pedidos.
    response.send('Hello Node')//resposta do back ouu resposta do cliente contem dados que realmente o cliente esperava receber
    
    //AULA: QUERY PARAMS
    //http://localhost:3000/users?name=lucas&age=22
    const name = request.query.name
    const age = request.query.age
    console.log(name, age)//lucas 22
    return response.json({name: name, age: age})
    //Destructuring assignment abrevidação:
    const { name, age } = request.query
    return response.json({name, age }) 
});
*/
//--------------------------------------------------------------------------------------------------------------------------------------------------
/*
//AULA: ROUTE PARAMS
// 'users/:id' meio que cira uma variavl ":id" deacordo com o request do usuario EX: http://localhost:3000/users/uva  params: { id='uva' }
app.get('/users/:id', (request, response) => {
    const { id } = request.params
    //console.log(id)
    return response.json({id})
});
*/
//--------------------------------------------------------------------------------------------------------------------------------------------------
/*
//AULA: BODY PARAMS: front tem um arquivo json onde usaremos o body params (nao e mostrado na url)
//insomnia(http://localhost:3000/users) > Body > JSON > 
//{
//	"name": "lucas",
//	"age": "22"
//}

app.use(express.json());//informar o formato de troca de dados. Ex:xml

app.get('/users', (request, response) => {
    //console.log(request.body)
    const { name, age } = request.body 
    return response.json({ name, age })
})
*/
//--------------------------------------------------------------------------------------------------------------------------------------------------
/**AULA: ROTAS
 * - GET            => Buscar informação no back-end
 * - POST           => Criar informação no back-end
 * - PUT / PATCH    => Alterar/Atualuzar informação no back-end
 * - DELETE         => Delete informação no back-end
 */

/*
//GET e POST 
//ao reiniciar o servifor node perde todas as informações, 
const users = [] //por isso nessa etapa era para salvar em um banco de dados. ms para fins didaticos.
app.use(express.json())//informar o formato de troca de dados. Ex:xmla

//retorna o valor da array com totos os users adicionados com o metudo post
app.get('/users', (request, response) => {
    return response.json(users)//rota get responde a requisição, que e a lista de usuarios
})
//falata o parametro id, porem ele e uma variavel que precisa acrecentado sozinho a cada requisição, para isso usamos:
//npm install uuid
app.post('/users', (request, response) => {
    const { name, age } = request.body//captura informação 

    //console.log(uuid.v4())
    const user = { id:uuid.v4(), name, age }//coloca em um objeto e add id

    users.push(user)// objeto add no arrey

    return response.status(201).json(user)//rota pust responde o que lhe foi requisitado(enviado)
})
//PUT 
//atualiza a informação do ususario, para isso devemos ter em mente qual e o usuario do banco de dados(route params para achar o ID), modificar(bory params) e salvar 
app.put('/users/:id', (request, response) => { 
    const { id } = request.params//requisito do front dando o ID do usuario 
 
    //precisamos saber qual e o index que o usuario esta no array, podemos usar filter, mas existe esse: 
    const index = users.findIndex(parametro => parametro.id == id)//vai percorrer users ate encontrar o index que seja == ao requisito do front, 
    //console.log(index) //se nao encontrar retorna -1, se sim retorna o index que estamos procurando 
    if(index < 0){ 
        return response.status(404).json({error: "user not found"})//rota put responde a requisição um erro 404
    } 
    //agora atualizar o array 
    const { name, age } = request.body//a informação nova 
    const updatedUser = { id, name, age }//compilando a informação nova com o ID 
    users[index] = updatedUser//salvando em cima do usuario solicitado 
 
    return response.json(updatedUser)//rota put responde o que lhe foi requisitado(enviado)
})
//DELETE 
// a logica e a mesma que put: qual usuario do Banco de dados vamos deletar(.splice) pelo ID
app.delete('/users/:id', (request, response) => {
    const { id } = request.params
    const index = users.findIndex(user => user.id == id)
    if(index < 0){
        return response.status(404).json({error: "user not found"})//rota delete responde a requisição um erro 404
    }
    users.splice(index,1)//retira e ordena os valores de <indie inicial>=index ate a <quantidade de indices que deseja retirar>=1

    return response.status(204).json()//rota delete responde status de sucesso e mais nada, afinal o que foi requisitado foi deletado.
})
*/
//--------------------------------------------------------------------------------------------------------------------------------------------------
/*
- Middlewares    => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
*/
/*
//AULA: middlewares na pratica:
const myFirtMiddlewares = (request, response, next) => {//Middlewares e um laço função que ajuda no controle das rotas e reaproveitamento de codigo
    console.log("foi chamado")//execulta primeiro

    next()//execulta todas as rotas

    console.log("finalizamos")// volta para execultar
}
app.use(myFirtMiddlewares)//AS ROTAS que estiver a cima disso nao esta no laço do Middlewares
*/
//--------------------------------------------------------------------------------------------------------------------------------------------------
//AULA: economizar codigo verificação se o id do usuario existe:
const users = [] 
app.use(express.json())

const checkUserID = (request, response, next) => {    
    const { id } = request.params
    const index = users.findIndex(user => user.id == id)

    request.userIndex = index;//cria um requerimento interceptado
    request.userId = id;//cria um requerimento interceptado

    if(index < 0){
        return response.status(404).json({error: "user not found"})
    }
    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age } = request.body
    const user = { id:uuid.v4(), name, age }

    users.push(user)
    return response.status(201).json(user)
})

app.put('/users/:id', checkUserID, (request, response) => { 
    //const { id } = request.params
    //const index = users.findIndex(parametro => parametro.id == id)
    //if(index < 0){ 
    //    return response.status(404).json({error: "user not found"})
    //} 
    const index = request.userIndex//informação que veio da Middlewares checkUserID
    const id = request.userId//informação que veio da Middlewares checkUserID

    const { name, age } = request.body 
    const updatedUser = { id, name, age }
    users[index] = updatedUser
 
    return response.json(updatedUser)
})

app.delete('/users/:id', checkUserID, (request, response) => {
    //const { id } = request.params
    //const index = users.findIndex(user => user.id == id)
    //if(index < 0){
    //    return response.status(404).json({error: "user not found"})
    //}
    const index = request.userIndex//informação que veio da Middlewares checkUserID

    users.splice(index,1)
    return response.status(204).json()
})

app.listen(port, () => console.log(`🚀 Server started on port ${port}`))
