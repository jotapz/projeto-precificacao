function Materiaprimapage() {
 return (
   <div className="container-fluid"
    style={{ maxWidth: "1200px", justifyContent: "center"}}>
     <div className="d-flex justify-content-between align-items-center">
       <h3>Matéria Prima</h3>
       <button className="btn btn-primary">+ Adicionar Matéria-Prima</button>
     </div>
     
     <div
        className="p-4 rounded shadow w-100 text-center mt-3"
        style={{ maxWidth: "1200px", justifyContent: "center", backgroundColor: "#cfcfcfff" }}
      >
        <p className="text-secondary">Nenhuma Matéria-Prima cadastrada.</p>
      </div>

   </div>
 );


}


export default Materiaprimapage;