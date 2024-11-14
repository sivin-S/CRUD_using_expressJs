import express, { json } from 'express'
const app = express()
import 'dotenv/config'
//  logs 
import logger from "./logger.mjs";
import morgan from "morgan";

app.use(express.urlencoded({extended:true})) // decoding form data transmission data to human readable
app.use(express.json()) //parsing json data 


// logs 
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        console.log("message >",message)
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);



/*
          ###################  CRUD operations  ###############   & shop is footwear  products     
   `Note:  app.get(  ...more  )  like regex (IM)   `
*/  



// data stored in array 
const products=[]
let id=0;

// get request 
app.get('/',function(req,res){
    try {
        


logger.info("This is an info message");
logger.error("This is an error message");
logger.warn("This is a warning message");
logger.debug("This is a debug message");


        res.type('json')
 return   res.status(200).send({message:'welcome to shop'})
    } catch (error) {
      throw new Error("Error : ",error);
    
    }finally{
        console.log("Get Route called !");
        
    }
})

app.get('/products',function(req,res){
    try {
        res.type('json')
        return   res.status(200).json(products)
    } catch (error) {
        throw new Error("Error : ",error)
    }finally{
        console.log("Get Route called !");
        
    }
})

// path parameter or dynamic routing --> get request 
app.get('/product/:id',function(req,res){

   try {
    const id = Number.parseInt(req.params.id,10);
    // console.log("id >", id);
    // console.log(products[0].id)
    const product = products.find((product,index)=> product.id===id);
    console.log('product >',product)
    if(!product){
        res.type('json')
    return    res.status(404).json({message: 'product not found'})
    }else{
        res.type('json')
     return   res.status(200).json({product})
    }
   } catch (error) {
      throw new Error("Error : ",error)
   }finally{
    console.log("Get Route called !");
    
}
})

// path parameter or dynamic routing (optional -> "user?" - checking user||'Guest' ) => get request 

// app.get('/:productName?',function(req,res){
//     const productName =  req.params.productName || 'No Product Found'
//     if(productName==='No Product Found'){
//          res.send(404).json({message: productName})
//     }else{
//         const productFound = products.find((product,index)=> product.name===productName)
//     }
// })

// wildcard " * " - checking use req.params[0] is arr => get request 

// app.get('/*/user',function(req,res){
//     res.send("....")
// })
// app.get('/user/*',function(req,res){
//     res.send("....")
// })

// query parameters => get request 

// app.get('/product',function(req,res){
//     const productName = req.query
//     // ..................
// })


//  post request
app.post('/product',function(req,res){
    // json data for testing not form data
    // console.log('arr >',products);
    
    console.log("req.body >> ",req.body)
  try{
    const {name,price} = req.body
    // console.log(typeof req.body)
    const productsAvailable = products.find((product)=> product.product.name===name)


    // console.log(productsAvailable)

   
        
        if(productsAvailable){
          return    res.status(404).json({message:'Product Not Added Already their!'})
        }else{
          products.push({id: id++,product:{name:name,price:price}})
          return   res.status(201).location('/products').json({
            message: 'data is created',
            data: {
               product: products
            }
          })
        }
  }catch(err){
       throw new Error("Error : ",err);
  }finally{
    console.log("Post Route called !");
    
}
    
})
// query 
app.put('/product/:id',function(req,res){
    const {name,price} = req.query
    
     try{
           // logic entire data updating

    const product = products.find((product)=>product.id===Number.parseInt(req.params.id,10))
    // console.log('pervious state >',perviousState)
    if(!product)  res.status(404).json({message: 'product not found!'})
    if(!name)  res.status(400).json({message: 'name is not found!'})
    if(!price)  res.status(400).json({message: 'price is not found!'})
   
        const productIndex = products.findIndex((product)=>product.product.name===product.name)
        products.splice(productIndex,1)
        products.push({id: id++,product:{name:name.replace(/^[\s'"]+|[\s'"]+$/g, ''),price:Number.parseInt(price,10)}})
        return res.sendStatus(204) 
     }catch(err){
        throw new Error('Error : ',err);
     } 
     finally{
         console.log("Put Route called !");
     }
})

app.patch('/product/:id',function(req,res){
    try {
        const {name,price} = req.query
    const returnedProduct = products.find((product)=>product.id===Number.parseInt(req.params.id,10))

     
    if(!returnedProduct)  res.status(404).json({message:'product not found!'})
    if(!name&&!price)  res.status(404).json({message:'value not found!'})
  products.forEach((product)=>{
        if(name){
           if(product.product.name===returnedProduct.product.name){
              return  product.product.name=name.replace(/^[\s'"]+|[\s'"]+$/g, "");
           }
        }else if(price){
            if(product.product.price===returnedProduct.product.price){
             return  product.product.price=Number.parseInt(price,10);
            }
        }
    })
    return res.sendStatus(204)
    } catch (error) {
        throw new Error("Error : ",error)
    }finally{
        console.log("Patch Route called !");
        
    }

})

//  fn is delete all db.deleteMany({}) not met  to been one delete...
app.delete('/:id',function(req,res){
  try {
    const productId = Number.parseInt(req.params.id)
    const product =  products.find((product)=> product.id===productId)
    if(!product)  res.status(404).json({message: "product not found!"})
    if(product){
        products.length=0
        // products.splice(0,products.length) is convert to empty arr
        return res.sendStatus(204)
    }
  } catch (error) {
    throw new Error('Error : ', error)
  }finally{
    console.log("Delete Route called !");
    
}
})



// 404 not found 
app.get('*',function(req,res,next){
    res.status(404).send('Not Found')
})



app.listen(process.env.PORT||8080,function(){
    console.log("Server connected")
})
