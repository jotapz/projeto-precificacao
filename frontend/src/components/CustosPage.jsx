function CustosPage() {
 return (
    <div className="container-fluid"
        style={{ maxWidth: "1200px", justifyContent: "center"}}>
     <div className="d-flex justify-content-between align-items-center">
       <h3>Custos Operacional</h3>
       <button className="btn btn-primary">+ Adicionar Custo Operacional</button>
     </div>
     
     <div
        className="p-4 rounded shadow w-100 text-center mt-3"
        style={{ maxWidth: "1200px", justifyContent: "center", backgroundColor: "#cfcfcfff" }}
      >
        <p className="text-secondary">Nenhum Custo Operacional cadastrado.</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-5">
       <h3>Despesas</h3>
       <button className="btn btn-primary">+ Adicionar Despesa</button>
     </div>
     
     <div
        className="p-4 rounded shadow w-100 text-center mt-3"
        style={{ maxWidth: "1200px", justifyContent: "center", backgroundColor: "#cfcfcfff" }}
      >
        <p className="text-secondary">Nenhuma Despesa cadastrada.</p>
      </div>

   </div>

   
 );


}


export default CustosPage;