const d = document
  $form = d.querySelector(".inputs"),
  $tabla = d.querySelector(".tabla"),
  $template = d.getElementById("datos_template").content,
  $fragment = d.createDocumentFragment()
;

// Envio de formulario

const getAll = async () =>{
  try{
    let res = await fetch("http://localhost:5555/Datos"),
      json = await res.json()
    ;

    if(!res.ok) throw Promise.reject(res.status,res.statusText)

    json.forEach(el => {
      $template.querySelector(".tnombre").textContent = el.nombre;
      $template.querySelector(".tapellido").textContent = el.apellido;
      $template.querySelector(".tdni").textContent = el.dni;
      $template.querySelector(".editar").dataset.id = el.id;
      $template.querySelector(".editar").dataset.nombre = el.nombre;
      $template.querySelector(".editar").dataset.apellido = el.apellido;
      $template.querySelector(".editar").dataset.dni = el.dni;
      $template.querySelector(".borrar").dataset.id = el.id;

      let $clone = d.importNode($template,true)
      $fragment.appendChild($clone)
    });
    $tabla.querySelector("tbody").appendChild($fragment);

  }catch(err){
    let mensaje = err.statusText || "Ocurrio un error";
    $tabla.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${mensaje}</b></p>`);
  };
};

d.addEventListener("DOMContentLoaded", getAll)

d.addEventListener("submit", async e=>{
  e.preventDefault()
  
  if(e.target === $form){
    if(!e.target.id.value){
      // Metodo POST - Crear

      let options;
      try{
        options = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            apellido: e.target.apellido.value,
            dni: e.target.dni.value
          })
        };

        res = await fetch("http://localhost:5555/Datos", options);
        json = await res.json();

        if(!res.ok) throw Promise.reject(res.status,res.statusText);
      }catch(err){
        let mensaje = err.statusText || "Ocurrio un error";
        $tabla.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${mensaje}</b></p>`);
      }
    }else{
      // Metodo PUT - Editar

      let options;
      try{
        options = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            apellido: e.target.apellido.value,
            dni: e.target.dni.value
          })
        };

        res = await fetch(`http://localhost:5555/Datos/${e.target.id.value}`, options);
        json = await res.json();
        
        if(!res.ok) throw Promise.reject(res.status,res.statusText);

      }catch(err){
        let mensaje = err.statusText || "Ocurrio un error";
        $tabla.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${mensaje}</b></p>`);
      };
    };
  };
});

$tabla.addEventListener("click", async e=>{

  if(e.target.matches(".editar")){
    $form.nombre.value = e.target.dataset.nombre;
    $form.apellido.value = e.target.dataset.apellido;
    $form.dni.value = e.target.dataset.dni;
    $form.id.value = e.target.dataset.id;

  } else {
    //DELETE - Borrar
    let isDelete = confirm(`Estas seguro que deceas eliminar los datos de ${e.target.dataset.id}`);

    if(isDelete){
      let options;
      try{
        options = {
          method: "DELETE",
        };
  
        res = await fetch(`http://localhost:5555/Datos/${e.target.dataset.id}`, options);
        json = await res.json();
  
        if(!res.ok) throw Promise.reject(res.status,res.statusText);
  
      }catch(err){
        let mensaje = err.statusText || "Ocurrio un error";
        $tabla.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${mensaje}</b></p>`);
      };
    };
  };
});




 