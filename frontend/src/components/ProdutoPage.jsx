function ProdutoPage() {
 return (
   <div className="container-fluid"
    style={{ maxWidth: "1200px", justifyContent: "center"}}>
     <div className="d-flex justify-content-between align-items-center">
       <h3>Produto</h3>
       <button className="btn btn-primary">+ Adicionar Produto</button>
     </div>
     
     <div
        className="p-4 rounded shadow w-100 text-center mt-3"
        style={{ maxWidth: "1200px", justifyContent: "center", backgroundColor: "#cfcfcfff" }}
      >
        <p className="text-secondary">Nenhum Produto cadastrado.</p>
      </div>

   </div>
 );


}


export default ProdutoPage;