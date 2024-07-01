/**
 * Router: Un router en Express es una manera de agrupar rutas relacionadas.
 * Es como un mini-servidor dentro del servidor principal.
 * Ayuda a organizar el código cuando tienes muchas rutas.
 * Cuando accedes a '/movies/sub_ruta' en tu navegador
* o herramienta como Postman, la aplicación:
 * Primero busca la ruta '/movies' en el archivo principal (server.js).
 * Luego delega el manejo de esa ruta al router moviesRouter.
 * Finalmente, dentro de moviesRouter, encuentra la subruta '/list'
 * y ejecuta la función correspondiente que devuelve "sub_ruta".
 */

// 1-Importamos modulo express
const express = require("express");

// 2-Instanciamos Router de express
const router = express.Router();

/* GESTION DEL ARCHIVO JSON */
// 3-Importacion del modulo de lectura fs
const fs = require("fs");

// 4-Importacion del modulo path
const path = require("path");

// 5-Utilizacion de path.join
const moviesPath = path.join(__dirname,"../public/movies.json");

// 6-Leemos y formateamos el archivo JSON (con un metodo asociado al fs)
const archivoJSON = fs.readFileSync(moviesPath, "utf-8");

// 7-Convertimos JSON a un array legible con javascript (mediante parseo)
const movies = JSON.parse(archivoJSON);
/* FIN DE LA GESTION DEL ARCHIVO */

// 8-DEFINICION DE LAS SOLICITUDES
// 8.1-Prueba con solicitud GET /movies/saludo 
router.get("/saludo", (req,res)=>{
    res.json({mensaje:"Hola desde la ruta de movies"});
})

// 8.2-Obtenemos el listado completo
router.get("/list", (req, res)=>{
    res.json(movies);
});

// 8.3-RUTAS PARAMETRICAS CON ID
router.get("/:id", (req, res)=>{

    const movie = movies.find(m=> m.id === parseInt(req.params.id))

    // Si no se encuentra la película
  if (!movie) {
    // Variable estado 404
    const estado404 = res.status(404);
    // Valor de retorno
    return estado404.send("Película no encontrada");
  }
    // Enviamos la pelicula encontrada 
        res.json(movie);
})

/* METODO POST: Carga de cero un dato a diferencia del metodo PUT */
// 9-Solicitudes del tipo POST
router.post("/", (req, res)=>{
  //Creamos un objeto con los datos del cuerpo de la solicitud de request (req)
  const nuevaPeli = {
    id: movies.length + 1,
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    image: req.body.image
  }

  //Agregamos nueva peli al array movies (PUSH)
  movies.push(nuevaPeli);

  //Convertimos el array movies a formato JSON
  const moviesActualizado = JSON.stringify(movies, null, 2);

  //Guardamos el array en movies.json
  fs.writeFileSync(moviesPath, moviesActualizado, "utf-8");

  //Enviamos un mensaje de exito
  res.status(201).json({
    mensaje: "Película agregada con exito",
    pelicula: nuevaPeli
  })
})

/* METODO PUT: Inspecciona algo que ya exista para actualizarlo o modificarlo. */
// 10-Actualizacion de datos mediante PUT
router.put("/:id", (req, res)=>{  // Parametros: ruta + funcion flecha 
  //Buscamos la peli con el ID solicitado
  const peliActualizada = movies.find(m=> m.id === parseInt(req.params.id));

  if (!peliActualizada) {
    // Variable estado 404
    const estado404 = res.status(404);
    // Valor de retorno
    return estado404.send("Película no encontrada");
  }
  
  //Proceso de modificacion
peliActualizada.title = req.body.title || peliActualizada.title;
peliActualizada.director = req.body.director || peliActualizada.director;
peliActualizada.year = req.body.year || peliActualizada.year;
peliActualizada.image = req.body.image || peliActualizada.image;

//Convertimos el array movies a formato JSON
const peliculasActualizadasJSON = JSON.stringify(movies, null, 2); //error ¿?

//Guardamos el array en movies.json
fs.writeFileSync(moviesPath, peliculasActualizadasJSON , "utf-8");

//Respondemos enviando la peli encontrada 
res.json(peliActualizada);

}) 

// Exportamos el modulo 
module.exports = router;