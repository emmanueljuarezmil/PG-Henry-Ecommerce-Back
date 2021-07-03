const {Producto} = require('../../db.js');
/* const { v4: uuidv4 } = require('uuid'); */
const axios = require('axios');

async function getProducts (req,res) {
    try{
        const request = await axios.get("https://api.mercadolibre.com/sites/MLA/search?category=MLA4275&limit=10");
        var product = request.data.results.map(product =>{
          return {
              id: product.id,
              name: product.title,
              price: product.price,
              foto: product.thumbnail,
              description: "instrumento",
              stock: product.available_quantity  
          }
        })
        return res.status(200).json({product});
    } catch (error){
        return res.status(404).send("ERROR")
    }
}



module.exports = {
    getProducts,
}
