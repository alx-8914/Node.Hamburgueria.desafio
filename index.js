const express = require('express')
const uuid = require('uuid')

const app = express()
const port = 3000
const orders = []
app.use(express.json())

// Middleware para verificar ID do pedido
const checkOrderId = (req, res, next) => {
  console.log('Middleware de parâmetro ID chamado');
  const { id } = req.params // Recebendo id pela url
  const index = orders.findIndex(order => order.id === id)  // Vai procurar a posição do objeto e armazenar na variavel

  if (index < 0) {
    return res.status(404).json({ message: '🚨Order not found' })
  }

  req.orderId = id
  req.orderIndex = index
  next()
}
// req = request
// res = response
// next = função que chama a próxima função do middleware
// Middleware para logar URL e método(GET,POST,PUT,DELETE, etc)
const checkOrderUrl = (req, res, next) => {
  console.log('Middleware de requisição: OK');
  const url = req.url;
  console.log('URL da requisição:', url);
  const method = req.method;
  console.log(`The method used is: ${method}, and the url used is: ${url}`)
  next()
}
// rota: pedidos, nome do cliente, valor do pedido
app.post('/orders', checkOrderUrl, (req, res) => {
  const { order, clientName, price } = req.body // recebendo pelo body
  console.log(req.body)
  const status = "Em preparação:🍔🥤😋."
  const newOrder = { id: uuid.v4(), order, clientName, price, status }  // Montando um objeto

  orders.push(newOrder)   // enviando o objeto montado para o array 

  return res.status(201).json({ newOrder })  // retorna o objeto criado com status de sucesso (201)
})
//rota: listagem dos pedidos
app.get('/orders', checkOrderUrl, (req, res) => {
  return res.json(orders)   // retorna o array
})
//Rota de Atualização do Pedido
app.put('/orders/:id', checkOrderId, checkOrderUrl, (req, res) => {
  const { order, clientName, price } = req.body; // recebendo pelo body
  const index = req.orderIndex;  // Pegando o index do pedido
  const id = req.orderId; // Pegando o id do pedido

  const updateOrder = { id, order, clientName, price, status: orders[index].status }; //  Mantém o status original
  orders[index] = updateOrder;  // Atualizando o pedido no array
  return res.status(200).json({ message: "😎pedido atualizado com Sucesso" })  // retorna o pedido atualizado com status
})
//Rota de Delete, excluir um pedido já feito
app.delete('/orders/:id', checkOrderId, checkOrderUrl, (req, res) => {
  const index = req.orderIndex  // Pegando o index do pedido
  orders.splice(index, 1)
  return res.status(200).json({ message: "⚠️Pedido deletado com sucesso!" })
})
//Rota de retorno de pedido específico.
app.get('/orders/:id', checkOrderId, checkOrderUrl, (req, res) => {
  const index = req.orderIndex  // Pegando o index do pedido
  const viewOrder = orders[index]  // Pegando o pedido
  return res.json(viewOrder)  // retorna com o pedido específico.
})
//pedido recebido pelo id para "Pronto"
app.patch('/orders/:id', checkOrderId, checkOrderUrl, (req, res) => {
  const { status, clientName } = req.body  // Coletando index do pedido
  const index = req.orderIndex;//// Índice do pedido
   // Verificar se o índice está dentro dos limites do array orders
   if (index < 0 || index >= orders.length) {
    return res.status(404).json({
      message: "🚨Pedido não encontrado."
    });
  }
  // Atualizar o pedido com os novos valores
  const order = orders[index];
  order.status = status; // Atualizando o pedido
  order.clientName = clientName; // Atualizando o pedido
  return res.status(200).json({
    clientName: clientName,
    order: order,// Erro foi corrigido: "Suporte devClub"
    message: "👍🍔🥤😋 Seu Pedido Pronto!"
  })

})

app.listen(port, () => {
  console.log(`😎🚀Server started on port ${port}`)
})